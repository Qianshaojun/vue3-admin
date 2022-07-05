import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { ConfigEnv } from 'vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import topLevelAwait from 'vite-plugin-top-level-await' // 解决打包top-await问题

const pathResolve = (dir: string) => resolve(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
    loadEnv(mode, process.cwd())
    return {
        plugins: [
            vue(),
            vueI18n({
                include: path.resolve(__dirname, './path/to/src/locales/**'), // 组件中使用i18n标签
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            }),
            topLevelAwait({
                promiseExportName: '__tla',
                promiseImportName: (i) => `__tla_${i}`,
            }),
        ],
        css: {
            // css预处理器
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    charset: false,
                    additionalData: '@import "./src/assets/style/global.less";',
                },
            },
        },
        build: {
            outDir: 'dist',
            minify: 'terser',
            sourcemap: false,
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            chunkSizeWarningLimit: 2000,
            brotliSize: false, // 打包体积不计算
            // 分类打包
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'index.html'),
                },
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/name-[hash].[ext]',
                },
            },
        },
        resolve: {
            alias: {
                '@': pathResolve('./src'),
                views: pathResolve('./src/views'),
                components: pathResolve('./src/components'),
                assets: pathResolve('./src/assets'),
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', // 去除vue-i18n warning
            },
        },

        base: './',
        publicDir: 'public',
        server: {
            port: 4000,
            host: '0.0.0.0', // 本地ip启动
            open: false,
            cors: true,
            hmr: true, // 热更新配置
            watch: {
                usePolling: true, // 热更新配置必须
            },
            proxy: {
                '/api': {
                    target: 'http://47.244.150.247:38069',
                    changeOrigin: true, // 是否允许不同源
                    secure: false, // 是否支持https
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    }
})
