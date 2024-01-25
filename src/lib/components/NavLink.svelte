<!-- <script lang="ts">
  import { page } from "$app/stores";
  export let link: string;
  export let label: string;


</script>

<li className="dropdownWrapper">
    <a href={link} className={styles.hasDropdown + " " + (path === link ? styles.active : "")}>
          {label}&nbsp;
          {children.length ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              viewBox="0 0 10 7"
              fill="none"
            >
              <path
                d="M4.71471 6.7608L9.42199 0.760803H0.00744629L4.71471 6.7608Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            ""
          )}
    </Link>
    {children.length > 0 && (
      <div
        className={styles.dropdown}
        style={{ "--cols": children.length }}
      >
        {children.map((navItem) => (
          <Link href={navItem.link} key={navItem.link} className={styles.dropdownItem}>
                <div className={styles.dropdownItemImgWrap}>
                  <img src={navItem.image.url} alt={navItem.image.alt} />
                </div>
                <div className={styles.dropdownItemContent}>
                  <p className={styles.dropdownItemTitle}>{navItem.label}</p>
                  <p className={styles.dropdownItemDescription}>
                    {navItem.description}
                  </p>
                  <p className={styles.dropdownItemCta}>{navItem.ctaText}</p>
                </div>
          </Link>
        ))}
      </div>
    )}
  </li> -->