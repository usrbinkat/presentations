---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
  - slidev-addon-excalidraw
title: 'Platform Factory -- Composable Infrastructure as Code'
author: Kat Morgan - aka @usrbinkat
colorSchema: dark
themeConfig:
  qrUrl: https://github.com/usrbinkat
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---

# Platform Factory

## Composable Infrastructure as Code

Pulumi-based platform factory that separates deployment logic from deployment config. The factory
builds platforms. The config determines what each platform looks like.

<!-- This talk covers the IaC architecture, the layering model, what exists today, and where the pattern extends. The audience should walk away understanding how to build a platform factory and why it makes platform-as-a-service viable at any scale. -->

---

layout: default color: cream

---

# What This Is

A Pulumi codebase structured as a factory:

- `src/core/` -- config loading, module discovery, provider registry, metadata
- `src/k8s/` -- 30+ Kubernetes component implementations (Cilium, Rook Ceph, KubeVirt, Konductor,
  Forgejo, etc.)
- `src/aws/` -- AWS provider implementations (EKS, S3, Route53, etc.)
- `stacks/` -- YAML configs that instantiate the factory for specific targets

The factory code knows **how** to deploy each component. The stack YAML knows **which** components
to deploy and **with what config**. New platform targets require new YAML files, not new Python
code.

This pattern already runs on three distinct hardware targets today. It extends to any target that
Pulumi supports.

<!-- This is not theoretical. The factory is in production on bare metal, Docker-based dev clusters, and enterprise datacenter hardware. -->

---

layout: full color: cream class: force-light

---

<Excalidraw drawFilePath="./platform-factory-rings.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!-- Three nested scopes. Inner ring: the factory itself (src/core/ for orchestration, src/k8s/ for 30+ components, src/aws/ for cloud providers). Mid ring: platform instances, each defined by a set of stack YAML files that point at the factory. Today this includes docker-dev (6 stacks), optiplex-admin (6 stacks), ucs-dev (7 stacks). Tomorrow: aws-prod, azure-staging, tenant VMware clusters. Outer ring: workloads running on deployed platforms. The inner ring builds the mid ring. The mid ring hosts the outer ring. The inner ring is built once and reused across all platform instances. -->

---

layout: default color: cream

---

# Vertical Integration: The Layer Model

Every platform instance decomposes into ordered deployment layers:

```
L0  platform    Namespaces + PSS + Cluster PKI + RBAC + Scoped Kubeconfigs
L1  network     Cilium CNI + cert-manager + Envoy Gateway + DNS + Auth
L2  storage     Snapshotter + Storage Backend + CNPG + Redis + OCI Registry
L3  kubevirt    KubeVirt Operator + CDI + CNAO + VM Scheduling Runtime
L4  operations  Forgejo Git + CI Runners + Prometheus + Dashboards
L5  workloads   Konductor VMs + Developer Workspaces + Tenant Platforms
```

Each layer is an independent Pulumi stack with its own state. Layer ordering enforces dependency
sequencing. A change in L1 (network) never triggers redeployment of L2 (storage) or L3 (kubevirt).
Each stack declares `components_deployment_order` for components within it.

The layer model is the composability primitive. Each layer composes cleanly on top of the previous
one, and any layer's components can be enabled/disabled per platform target.

<!-- This is the vertical integration story. From bare metal networking to developer VM workstations, every layer is managed by the same factory with typed config validation. -->

---

layout: full color: cream class: force-light

---

<Excalidraw drawFilePath="./stack-layer-cake.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!-- Three columns showing the same 6 layers on three current platform targets. The platform layer (L0) is nearly identical across all targets. Network (L1) shares Cilium and cert-manager but diverges on L2 pool addresses, interface names, and ingress topology. Storage (L2) diverges the most: HostPath for Docker-based dev (no block devices in containers) vs Rook Ceph with per-node NVMe+SSD+HDD disk inventory on bare metal. KubeVirt (L3) adapts per target (masquerade networking on Docker vs bridge+macvtap on bare metal). Operations (L4) scales from Forgejo-only to full Forgejo+Runners+Prometheus+Headlamp. The key observation: same layers, different config values. Same component code, different enabled/disabled flags. -->

---

layout: full color: cream class: force-light

---

<Excalidraw drawFilePath="./shared-src-architecture.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!-- The factory pipeline. Stack YAML feeds core/config.py (Pydantic validation via GlobalMetadata singleton). core/discovery.py scans the filesystem for component modules by convention (any directory with __init__.py that is not core/). core/registry.py provides ProviderRegistry for cross-module provider sharing and deployment ordering. Components subclass BaseK8SComponent[TConfig] with generic typing. Each component contains models/ (Pydantic typed config per domain), profiles.py (platform presets), and builders/ (Helm value generation). The bottom section shows 14 representative components by name plus 20+ more. The flow is fully dynamic: __main__.py has zero hardcoded module names. -->

---

layout: default color: slate

---

# Config-Driven Differentiation

Same component, different configs per target:

```yaml
# Target A: docker-dev-storage.yaml    # Target B: optiplex-admin-storage.yaml
rook_ceph_operator:                     rook_ceph_operator:
  enabled: false                          enabled: true
hostpath_provisioner_operator:            spec:
  enabled: true                             ceph_version: v20.2.0
  spec:                                     storage:
    storage_pools:                            nodes:
      - name: local-storage                     - name: op1
        path: /var/mnt/local-storage              devices:
    storage_classes:                                - nvme-Sabrent_2TB
      - name: hostpath-csi                         - wwn-Samsung_1TB_SSD
        is_default: true                           - wwn-WD_Red_6TB_HDD
```

The storage component code exists once. The stack YAML determines whether HostPath or Ceph deploys,
and with what disk topology, replication factor, and storage class names. This extends to any
storage backend by adding a component to the factory and enabling it in YAML.

<!-- The audience needs to understand this: the YAML is not a template. It is a typed configuration surface validated by Pydantic models with JSON Schema generation for IDE autocomplete. Invalid config crashes at validation time, not at deploy time. -->

---

layout: full color: cream class: force-light

---

<Excalidraw drawFilePath="./component-composition.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!-- Left: component anatomy using Cilium as example. __init__.py subclasses BaseK8SComponent. models/ contains Pydantic models per config domain (CiliumConfig, GatewayConfig, HubbleConfig, L2Config, RoutingConfig). profiles.py holds platform presets (vxlan tunnel for Docker, native routing for bare metal, Cloudflare integration for datacenter). builders/helm.py converts validated Pydantic models into Helm values dict. Right: the 5-step flow from YAML to Kubernetes. This pattern repeats identically for all 30+ components. New components follow the same contract. -->

---

layout: default color: cream

---

# The Component Contract

```
k8s/components/{name}/
  __init__.py          # BaseK8SComponent[TConfig] subclass
  models/
    __init__.py
    {feature}.py       # Pydantic model per config domain
  profiles.py          # Platform presets (optional)
  builders/
    helm.py            # Pydantic model -> Helm values dict
```

`BaseK8SComponent[TConfig]` enforces:

- Generic typing for type-safe `self.config` access
- Pydantic validation at init, fail before deploying bad config
- JSON Schema auto-generation for stack YAML authoring
- `config_class` attribute declaration, no implicit config loading

`core/discovery.py` enforces:

- Filesystem scan finds components by convention
- `__module_metadata__` required (version, provider, dependencies)
- Import failures are fatal, broken modules crash immediately

<!-- The contract is rigid by design. A new component author creates a directory, writes Pydantic models, implements deploy(). The framework handles discovery, config loading, validation, ordering, and schema generation. -->

---

layout: default color: slate

---

# The Dynamic Entrypoint

```python
# src/__main__.py -- zero hardcoded module names
def main() -> None:
    metadata = load_and_validate_config()  # GlobalMetadata singleton
    registry = ProviderRegistry()
    config = load_configuration()          # Only enabled modules

    enabled_modules = config["enabled_modules"]  # Pydantic models
    execution_order = config["module_execution_order"]

    for module_name in all_modules:
        module = registry.load_and_validate_module(
            module_name, enabled_modules[module_name]
        )
        module.initialize()
        module.deploy()

    export_stack_outputs(deployed_modules)
```

This entrypoint is stable. Adding a component never touches it. Adding a platform target never
touches it. All variation lives in component directories and stack YAML.

<!-- The entrypoint is ~100 lines. It delegates entirely to the framework. This is the structural guarantee that the factory remains composable as it grows. -->

---

layout: full color: cream class: force-light

---

<Excalidraw drawFilePath="./platform-commoditization.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!-- Left: the factory is ~15k lines of Python (core/ framework, 30+ component implementations, Pydantic models, JSON Schema, platform profiles). Middle: current platform instances, each a set of YAML files. Future instances extend the same factory. Right: the incremental cost curve. First platform carries the factory build cost. Each subsequent platform costs only YAML authoring. The factory amortizes across all targets. -->

---

layout: default color: cream

---

# What Exists Today

**Undercloud substrate (operational):**

- docker-dev: Talos K8s in Docker Compose, single-node, HostPath storage, sslip.io domains
- optiplex-admin: 3x Dell OptiPlex 7040 bare metal, Talos, 3-tier Rook Ceph (NVMe+SSD+HDD), 10GbE
- ucs-dev: Cisco UCS datacenter blades, Talos, multi-tier Ceph, Cloudflare tunnels, Prometheus
  monitoring

**Deployed components across these targets:**

- Cilium CNI with Gateway API, L2 LoadBalancer, Hubble observability
- cert-manager with cluster PKI (ECDSA P-384 root CA, Hubble mTLS certs, SSH key management)
- Envoy Gateway for all HTTPRoute/TCPRoute traffic
- Rook Ceph or HostPath storage with External Snapshotter
- CloudNativePG PostgreSQL operator, Redis operator
- Zot OCI registry (container images, qcow2 VM images, SBOMs)
- KubeVirt virtualization with CDI, snapshot cloning, CNAO for OVS networking
- Konductor NixOS VMs for developer workstations (nested virt, dual-NIC, workspace PVCs)
- Forgejo git server with PostgreSQL backend and KubeVirt-based CI runners

<!-- This is what runs. Not a roadmap. Operational infrastructure serving real developer workloads today. -->

---

layout: default color: cream

---

# Where The Pattern Extends

**Tenant platforms on the undercloud:**

- KubeVirt VM clusters running as tenant platforms on the undercloud substrate
- VMware as a service: deploy vSphere clusters as KubeVirt VMs with PCI passthrough
- Hyper-V as a service: Windows Server VMs with nested Hyper-V for Windows workloads
- OpenShift as a service: OKD/OpenShift clusters deployed as KubeVirt VMs
- Digital twins: deploy the entire platform as a nested replica for testing

**Cloud provider extensions:**

- `src/aws/` already exists for EKS, S3, Route53 integration
- `src/azure/` extends the factory to AKS, Azure Blob, Azure DNS
- `src/vmware/` extends to vSphere API for bare metal VM provisioning
- `src/hyperv/` extends to Hyper-V SCVMM for Windows infrastructure

Each provider module follows the same contract: Pydantic models, component discovery, registry-based
deployment. The stack YAML for an AWS target selects `src/aws/` and `src/k8s/` components. The
factory code handles both.

<!-- The composability works because the factory is provider-agnostic at the core level. core/discovery.py scans all top-level src/ directories, not just k8s/. Adding src/azure/ is structurally identical to adding src/aws/. -->

---

layout: default color: slate

---

# Reproducible Large-Scale Compute

The factory pattern enables something previously impractical: reproducible vertical integration from
bare metal networking through application-layer workloads.

**What this means concretely:**

- Deploy a platform. Run a compute workload. Tear it down. Deploy it again identically.
- The platform config is in version control. The deployment is deterministic.
- A biochem simulation that requires specific NUMA topology, GPU passthrough, and Ceph-backed
  scratch storage can be defined as a platform config + workload config.
- An LLM training run that needs 8 GPU nodes with NVMe local storage and RDMA networking is a stack
  YAML + component config.

**Why this was not viable before:**

- Infrastructure was hand-configured. Reproducing a cluster meant reproducing manual steps.
- Even with IaC, the code was coupled to one target. Reproducing on different hardware meant
  rewriting.
- The factory decouples the "what" from the "where". The compute science workload defines what it
  needs. The platform config adapts to whatever hardware is available.

Peer review in compute-intensive sciences requires reproducing the full compute environment, not
just the application code. The factory makes the compute environment a versioned, reproducible
artifact.

<!-- This is the high-end capability. Platform reproducibility at the infrastructure level enables peer review of the full execution environment, not just the algorithm. This is relevant to biochem, pharma, AI/ML, and any domain where the compute environment affects results. -->

---

layout: default color: cream

---

# Architecture Summary

```
stacks/                          # Platform instance configs
  Pulumi.{target}-{layer}.yaml  # Typed YAML, Pydantic-validated

src/
  __main__.py                    # Dynamic entrypoint (100 lines, stable)
  core/
    config.py                    # GlobalMetadata, Pydantic validation
    discovery.py                 # Filesystem scan, module convention
    registry.py                  # ProviderRegistry, deployment ordering
    metadata.py                  # Stack config schema generation
  k8s/
    components/                  # 30+ Kubernetes components
      {name}/
        __init__.py              # BaseK8SComponent[TConfig]
        models/                  # Pydantic typed config
        profiles.py              # Platform presets
        builders/                # Helm values generation
  aws/                           # AWS provider components
  # future: azure/, vmware/, hyperv/
```

The factory is the `src/` tree. Platform instances are `stacks/` YAML. Adding a platform means
adding YAML. Adding a component means adding a directory to `src/k8s/components/`. Adding a cloud
provider means adding a directory to `src/`.

<!-- This is the architecture reference slide. The audience should be able to navigate the codebase from this slide alone. -->

---

layout: statement color: slate

---

# Separate the factory from the instances.

# The factory deploys components. The config selects which ones. The platform is a function of its config.

<!-- Two declarative statements. This is the entire architectural pattern. -->

---

layout: cover color: slate

---

# Platform Factory

## Composable Infrastructure as Code

Kat Morgan -- @usrbinkat

One factory. Any target. Config is the only variable.
