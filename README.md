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

Search `index.html` for `EDIT:` comments: stats, prices, opening hours and contact details.

## Run locally

```
python -m http.server 5510
```
Then open http://localhost:5510

## Libraries

- [GSAP 3.12.5](https://gsap.com/) + ScrollTrigger (via cdnjs)
- Google Fonts: Cinzel, Oswald, Inter
