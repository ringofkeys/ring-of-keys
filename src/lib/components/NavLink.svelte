<script lang="ts">
	import { type NavQuery } from '$lib/generatedGraphQLTypes';

	const pathname = '/';

	export let item: NonNullable<NonNullable<NonNullable<NavQuery['menu']>['children']>[0]>;
</script>

<li class="dropdownWrapper">
	<a href={item.link || '/'} class={`hasDropdown ${pathname === item.link ? 'active' : ''}`}>
		{item.label}&nbsp;
		{#if item.children?.length}
			<svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 10 7" fill="none">
				<path d="M4.71471 6.7608L9.42199 0.760803H0.00744629L4.71471 6.7608Z" fill="currentColor" />
			</svg>
		{/if}
	</a>
	{#if item.children?.length}
		<div class="dropdown" style={`--cols: ${item.children.length}`}>
			{#each item.children as navItem}
				{#if navItem}
					<a href={navItem.link} class="dropdownItem">
						<div class="dropdownItemImgWrap">
							<img src={navItem.image?.url} alt={navItem.image?.alt} />
						</div>
						<div class="dropdownItemContent">
							<p class="dropdownItemTitle">{navItem.label}</p>
							<p class="dropdownItemDescription">
								{navItem.description}
							</p>
							<p class="dropdownItemCta">{navItem.ctaText}</p>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	{/if}
</li>
