import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
	server: {
		port: 3000,
		strictPort: true,
	},
	preview: {
		port: 3000,
		strictPort: true,
	},
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
}))
