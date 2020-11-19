import workerpool from 'workerpool'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { join } from 'path'
import { noop } from 'vtils'

function rollupDts(dtsFiles: string[], includedPackages: string[] = []) {
  const consoleLog = console.log
  console.log = noop
  dtsFiles.forEach(dtsFile => {
    const config = ExtractorConfig.prepare({
      configObjectFullPath: join(process.cwd(), './api-extractor.json'),
      configObject: {
        projectFolder: process.cwd(),
        mainEntryPointFilePath: dtsFile,
        bundledPackages: includedPackages,
        apiReport: { enabled: false, reportFileName: 'report.api.md' },
        dtsRollup: { enabled: true, untrimmedFilePath: dtsFile },
        tsdocMetadata: { enabled: false },
        docModel: { enabled: false },
        compiler: {
          tsconfigFilePath: join(process.cwd(), './tsconfig.json'),
        },
        newlineKind: 'lf',
      },
      packageJsonFullPath: join(process.cwd(), './package.json'),
      packageJson: {
        name: 'hello',
      } as any,
    })
    Extractor.invoke(config, {
      localBuild: true,
    })
  })
  console.log = consoleLog
}

workerpool.worker({
  rollupDts,
})
