import { describe, expect, it } from 'vitest'
import { repositoryUrl } from '../../../lib/git-utils'

describe('repositoryUrl', () => {
  it('converts SSH git@ remote to HTTPS', () => {
    expect(repositoryUrl('git@github.com:usrbinkat/presentations.git'))
      .toBe('https://github.com/usrbinkat/presentations')
  })

  it('converts ssh:// remote to HTTPS', () => {
    expect(repositoryUrl('ssh://git@github.com/usrbinkat/presentations.git'))
      .toBe('https://github.com/usrbinkat/presentations')
  })

  it('strips .git suffix from HTTPS remotes', () => {
    expect(repositoryUrl('https://github.com/usrbinkat/presentations.git'))
      .toBe('https://github.com/usrbinkat/presentations')
  })

  it('passes through clean HTTPS remotes unchanged', () => {
    expect(repositoryUrl('https://github.com/usrbinkat/presentations'))
      .toBe('https://github.com/usrbinkat/presentations')
  })

  it('handles org/repo with dots in name', () => {
    expect(repositoryUrl('git@github.com:org/repo.name.git'))
      .toBe('https://github.com/org/repo.name')
  })
})
