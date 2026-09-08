{
  description = "Braincraft Presentations — Slidev monorepo with Aurora design system";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    konductor = {
      url = "github:braincraftio/konductor";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      konductor,
      ...
    }:
    let
      # x86_64-darwin removed: nixpkgs-unstable 26.11 dropped it.
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          # Linux: #frontend provides Playwright browser deps + Node.js + pnpm.
          # Darwin: #full provides Node.js + pnpm (Playwright not packaged for macOS in nixpkgs).
          #         Playwright browsers are installed via npx on Darwin.
          baseShell = konductor.devShells.${system}.${if pkgs.stdenv.isLinux then "frontend" else "full"};
        in
        {
          default = baseShell.overrideAttrs (old: {
            name = "presentations";

            nativeBuildInputs =
              old.nativeBuildInputs
              ++ pkgs.lib.optionals pkgs.stdenv.isDarwin [
                # Darwin: playwright-driver provides the CLI; browsers download at runtime
                pkgs.playwright-driver
              ];

            env =
              old.env
              // {
                KONDUCTOR_SHELL = "presentations";
              }
              // pkgs.lib.optionalAttrs pkgs.stdenv.isDarwin {
                # On Darwin, Playwright downloads browsers to this cache dir at runtime
                # via `npx playwright install chromium`. No nix-packaged browsers available.
                PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "0";
              };

            shellHook = old.shellHook + ''
              echo "Presentations shell ready"
            '';
          });
        }
      );
    };
}
