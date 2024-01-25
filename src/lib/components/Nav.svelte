<script lang="ts">
	import type { NavQuery } from '$lib/generatedGraphQLTypes';
	import NavLink from '$lib/components/NavLink.svelte';

	export let menu: NavQuery['menu'];
	let sortedChildren = menu?.children?.sort((a, b) => (a?.position || 0) - (b?.position || 0))!;

	let open = false;
</script>

<header class="header">
	<nav class={`top-nav ${open ? 'open' : 'closed'}`}>
		<div class="top__inner">
			<a href="/" class="site-logo">
				<img src="/img/rok_logo.png" alt="Ring of Keys" />
			</a>
			<button
				class="menuIconWrapper"
				on:click={() => {
					open = !open;
				}}
			>
				<span class="menuIcon"></span>
			</button>
		</div>
		<div class="nav__mobile-wrap">
			<!-- <SecondaryNav session={session} navOpen={isNavOpen} /> -->
			<div class="nav__main">
				{#each sortedChildren as item}
					{#if item}
						<NavLink {item} />
					{/if}
					<!-- {#if session}
						<NavLink {path} label={'Dashboard'} link={'/dashboard'} />
					{/if} -->
				{/each}
			</div>
		</div>
	</nav>
</header>

<style lang="postcss">
	.top-nav {
		font-family: 'Raleway', sans-serif;
		font-weight: normal;
		background: var(--nav-bg);
		position: relative;
		min-height: 8vh;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2.5vh 4vw 0;
		box-shadow: var(--rok-shadow_bottom);
		z-index: 10;
	}

	.top-nav,
	.top-nav .nav__main,
	.top-nav .nav__login {
		background: var(--nav-bg);
	}

	.top-nav a {
		text-decoration: none;
		display: flex;
		width: fit-content;
		transition: all 0.12s ease-in-out;
		position: relative;
		align-items: center;
	}

	.top-nav a:not(.site-logo):not(.login_avatar)::after {
		position: absolute;
		content: '';
		top: 100%;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--rok-gold-1_hex);
		transition: width 0.13s ease-in-out;
	}

	/* .top-nav a:hover {
    transform: scale(1.08);
} */

	.site-logo {
		max-height: 100%;
		max-width: 20vw;
	}
	.site-log:hover {
		transform: scale(1.04);
	}

	.site-logo img {
		max-height: 100%;
		width: 100%;
	}

	/* Hamburger menu base styles (more in mobile media query) */
	.top-nav .hamburger {
		display: none;
	}

	.nav__mobile-wrap {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
	}

	.nav__login {
		margin-block-end: 3vh;
	}

	.nav__login > * {
		color: #e4ab25;
		font-size: 0.9rem;
		margin: 0 1.5em;
	}

	.top-nav .login_wrap {
		display: flex;
		align-items: center;
	}

	.top-nav .active {
		position: relative;
		font-weight: 600;
	}

	.top-nav a:not(.site-logo):hover::after,
	.top-nav a:not(.site-logo):focus::after,
	.top-nav .active:not(.site-logo):not(.login_avatar)::after {
		width: 100%;
	}

	.nav__login > *:last-child {
		margin-right: 0;
	}

	.loginBtn {
		background: var(--rok-slate-blue_hex);
		color: white;
		text-transform: uppercase;
		padding: 0.25rem 1.25rem;
		border-radius: 0.3em;
	}

	.loginBtn::after {
		display: none;
	}

	.nav__main {
		color: var(--rok-gray-1_hex);
		text-transform: uppercase;
		display: flex;
		list-style: none;
		margin: 0;
	}

	.nav__main a:hover > svg path {
		fill: #e4ab25;
	}

	.nav__main > * {
		margin: 0 1vw;
		padding-block-end: 2rem;
	}
	.nav__main > *:first-child {
		margin-inline-start: 0;
	}
	.nav__main > *:last-child {
		margin-inline-end: 0;
	}

	.dropdown-group {
		position: relative;
		display: inline-block;
	}

	.dropdownWrapper {
		padding-block-end: 2rem;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		width: 100%;
		left: 0;
		visibility: hidden;
		display: none;
		opacity: 0;
		background: white;
		box-sizing: border-box;
		padding: 2em 10vw;
		box-shadow:
			0 0 0 rgba(0, 0, 0, 0.4),
			0 0 0 rgba(0, 0, 0, 0.2);
		transition: all 0.12s ease-in-out;
		display: grid;
		justify-content: center;
		/* Columns are defined as a CSS variable directly on the element */
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 5vw;
	}

	.dropdownItem::after {
		display: none;
	}

	.dropdownItem img {
		max-width: 150px;
	}

	.dropdownItemImgWrap {
		box-shadow:
			0 0 0 rgba(0, 0, 0, 0),
			0 0 0 rgba(0, 0, 0, 0);
		transition: all 0.11s ease-out;
	}

	.dropdownItem:hover .dropdownItemImgWrap,
	.dropdownItem:focus .dropdownItemImgWrap {
		box-shadow:
			0 0.5rem 0.7rem rgba(97, 89, 89, 0.06),
			0 0.9rem 1.1rem rgba(0, 0, 0, 0.02);
	}

	.dropdownItemContent {
		margin-inline-start: 2rem;
	}

	.dropdownItemTitle,
	.dropdownItemCta {
		color: var(--rok-slate-blue_hex);
	}

	.dropdownItemDescription {
		font-size: 1rem;
		margin: 1rem 0;
		font-family: var(--serif);
		letter-spacing: 0.3px;
		font-weight: normal;
		text-transform: none;
		color: var(--rok-gray-1_hex);
	}

	.dropdownItemCta {
		font-weight: normal;
		font-size: 0.9rem;
	}

	.dropdownItemCta::after {
		content: '>';
		display: inline-block;
		position: relative;
		margin-inline-start: 0.5rem;
		transform: translateX(0);
		transition: 0.11s ease-out;
	}

	.dropdownItem:hover .dropdownItemCta::after,
	.dropdownItem:focus .dropdownItemCta::after {
		transform: translateX(0.25rem);
	}

	.hasDropdown:hover + .dropdown,
	.hasDropdown:focus + .dropdown,
	.dropdownWrapper:hover .dropdown,
	.dropdownWrapper:focus-within .dropdown {
		visibility: visible;
		opacity: 1;
		display: grid;
		box-shadow:
			0 5vh 1.5vh rgba(97, 89, 89, 0.06),
			0 1.3vh 2.8vh rgba(0, 0, 0, 0.02);
	}

	.nav__login {
		@apply flex items-center;
	}

	.top-nav .login_avatar {
		@apply flex items-center h-8 mx-4;
	}

	.top-nav .login_avatar img {
		margin: 0 0.5em;
		max-height: 100%;
		border-radius: 50%;
		object-fit: scale-down;
	}

	.menuIconWrapper {
		display: none;
		background: none;
		border: none;
		padding: 1vmin;

		--line-width: 8vmin;
		--line-height: 1vmin;
		--line-border-radius: 0.5vmin;
		--line-bg: var(--rok-slate-blue_hex);
		--line-spacing: 2vmin;

		height: calc(2 * var(--line-spacing) + 3 * var(--line-height));
	}

	.menuIconWrapper:focus {
		outline: none;
		--line-bg: var(--rok-pale-green-1_hex);
	}

	.menuIcon,
	.menuIcon::before,
	.menuIcon::after {
		display: block;
		width: var(--line-width);
		height: var(--line-height);
		border-radius: var(--line-border-radius);
		background: var(--line-bg);
		transform-origin: 50% 50%;
		transition: all 0.2s ease-in-out;
	}

	.menuIcon {
		position: relative;
	}

	.menuIcon::before,
	.menuIcon::after {
		position: absolute;
		content: '';
	}

	.menuIcon::before {
		bottom: calc(100% + var(--line-spacing));
	}

	.menuIcon::after {
		top: calc(100% + var(--line-spacing));
	}

	.open .menuIcon {
		transform: rotate(135deg);
	}

	.open .menuIcon::before {
		transform: translate(0, calc(var(--line-spacing) + var(--line-height)));
	}

	.open .menuIcon::after {
		transform: translate(0, calc(-1 * (var(--line-spacing) + var(--line-height)))) rotate(-90deg);
	}

	/* MOBILE STYLING */
	@media (max-width: 700px) {
		.header {
			position: sticky;
			z-index: 10;
			top: 0px;
		}

		.menuIconWrapper {
			display: block;
		}

		.top-nav {
			padding: 0;
			padding-block-start: 2.5vh;
			display: grid;
			grid-template-rows: 8vh 1fr;
			box-sizing: border-box;
			justify-content: stretch;
		}
		.top-nav.open {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: 100%;
			padding-inline-start: 0;
			padding-inline-end: 0;
		}

		.site-logo {
			max-width: 45vw;
		}

		.top-nav .top__inner {
			display: flex;
			width: 100%;
			justify-content: space-between;
			padding: 2.5vh 8vw;
			box-sizing: border-box;
		}

		.top-nav .hamburger {
			display: initial;
		}

		.nav__mobile-wrap {
			display: none;
			height: 0;
			width: 100%;
			transition: all 0.12s ease-in-out;
		}

		.top-nav.open .nav__mobile-wrap {
			display: grid;
			height: 100%;
			grid-template-rows: 1fr auto;
			width: 100%;
			justify-content: stretch;
		}

		.top-nav .nav__main {
			order: -1;
			width: 100%;
			display: grid;
			grid-auto-rows: 1fr;
			@apply ml-8;
			height: 100%;
			justify-content: stretch;
		}

		.nav__login a {
			font-size: 1rem;
		}

		.top-nav .nav__main > a {
			border-top: solid 0.5px;
			display: flex;
			width: 100%;
			margin: 0;
			box-sizing: border-box;
			align-items: center;
			padding: 0 8vw;
		}

		.top-nav .nav__main > a:last-child {
			border-bottom: solid 0.5px;
		}

		.top-nav .nav__login {
			background: #f7f7f7;
			display: block;
			padding: 2vh 8vw;
			box-shadow: var(--rok-shadow_bottom);
			width: 100%;
			box-sizing: border-box;
			margin-block-end: 0;
		}

		.top-nav .login_wrap {
			display: block;
		}

		.top-nav .nav__login a {
			margin: 1vh 0;
			font-size: 1rem;
			display: block;
		}

		.top-nav .nav__login [href='#logout'] {
			border: solid 1px var(--rok-slate-blue_hex);
			color: var(--rok-slate-blue_hex);
			padding: 0.5em 1.5em;
			border-radius: 0.25em;
			width: fit-content;
		}

		.loginBtn {
			margin: 0;
			padding: 0.5em 2em;
			width: fit-content;
		}

		.nav__login a:first-of-type {
			margin-block-end: 3vh;
			padding: 0.5em 2em;
		}

		.top-nav .nav__login a.login_avatar {
			padding: 0.5em 0;
			display: flex;
		}

		.dropdown,
		.nav__main a > svg {
			display: none;
			display: none;
		}
	}
</style>
