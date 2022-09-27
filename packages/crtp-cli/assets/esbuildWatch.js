
(async () => {
    const cssModulesPlugin = require('esbuild-css-modules-plugin');
    const esbuild = require('esbuild')
    let result = await esbuild.build({
        entryPoints: ['src/index.js'],
        assetNames: 'assets/[name]-[hash]',
        entryNames: '[name]',
        bundle: true,
        outdir: 'out',
        loader: {
            '.js': 'jsx',
            '.css': 'css',
        },
        watch: true,
        metafile: true, // 用于分析

        banner: {
          js: '// author: xxx',
          css: '/* author: xxx */',
        },
        chunkNames: '[name]-[hash]',
        color: true,
        drop: ['debugger', 'console'],
        incremental: true,
        // jsx: 'automatic',
        // jsxDev: true,
        // jsFactory: 'Fragmet',
        keepNames: true,
        legalComments: 'eof',
        logLevel: 'error',
        // logLimit: 10, // default
        supported: {
          // biging: false
        },
        plugins: [cssModulesPlugin()]
    })
    require('fs').writeFileSync('meta.json', JSON.stringify(result.metafile))
})()