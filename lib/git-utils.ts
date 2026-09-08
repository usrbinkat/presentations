// lib/git-utils.ts
// Pure utility functions for git metadata. Separated from vite.config.ts
// so tests can import without pulling in Vite plugin dependencies.

import { execFileSync } from 'node:child_process'
import process from 'node:process'

export function git(...args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()
}

export function repositoryUrl(remote: string): string {
  return remote
    .replace(/\.git$/, '')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/^ssh:\/\/git@github\.com\//, 'https://github.com/')
}

export function buildDate(): string {
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH
  return sourceDateEpoch
    ? new Date(Number(sourceDateEpoch) * 1000).toISOString()
    : new Date().toISOString()
}
