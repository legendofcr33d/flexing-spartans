# Flexing Spartans Fitness Center

Official website of Flexing Spartans Fitness Center. Static site hosted on GitHub Pages.

## Structure

```
index.html            page content (sections: hero, about, programs, membership, schedule, contact)
assets/css/style.css  all styles (tokens at the top)
assets/js/background.js  animated canvas background (embers, helmets, arrow volleys)
assets/js/main.js     nav, GSAP scroll animations, counters, card tilt
assets/img/           logo, favicon, warrior silhouette for the marching phalanx
```

## Editing content

Search `index.html` for `EDIT:` comments: stats and contact details still to add.

Gallery photos live in `assets/img/gallery/` as two WebP files each: `name-sm.webp` (720px wide, grid thumbnail)
and `name.webp` (1600px wide, opened in the lightbox). To add one, export both sizes and copy one
`<a class="gallery__item">` block in the Gallery section.

## Run locally

```
python -m http.server 5510
```
Then open http://localhost:5510

## Libraries

- [GSAP 3.12.5](https://gsap.com/) + ScrollTrigger (via cdnjs)
- Google Fonts: Cinzel, Oswald, Inter
