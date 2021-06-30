import _path, { PlatformPath as _PlatformPath } from 'path'

export interface PlatformPath extends _PlatformPath {
  toUnixPath: (path: string) => string
}

export const path: PlatformPath = {
  ..._path,
  toUnixPath: path => path.replace(/\\/g, '/'),
}
