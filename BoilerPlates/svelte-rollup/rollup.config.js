import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),

		// inject WASM files from SciChart into the bundle
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'scichart2d.wasm',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart2d.wasm')
				});
			}
		},
		// scichart2d.data
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({ 
					type: 'asset',
					fileName: 'scichart2d.data',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart2d.data')
				});
			}
		},
		// scichart2d.js
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'scichart2d.js',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart2d.js')
				});
			}
		},
		// now again for scichart3d (only if you use 3D charts)
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'scichart3d.wasm',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart3d.wasm')
				});
			}
		},
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'scichart3d.data',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart3d.data')
				});
			}
		},
		{
			name: 'wasm',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'scichart3d.js',
					source: fs.readFileSync('node_modules/scichart/_wasm/scichart3d.js')
				});
			}
		},

		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
