import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;

gsap.defaults({
	overwrite: 'auto',
});

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {
			Popups: require('sp.popups').default,
		};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');

			this.modules.Popups.animations.fadeUp = (popup, сompleteHandler) => {
				gsap.fromTo(
					popup,
					{ autoAlpha: 0, y: 50, scale: 0.98, display: 'block' },
					{
						autoAlpha: 1,
						y: 0,
						scale: 1,
						duration: 0.35,
						onComplete: () => {
							сompleteHandler();
						},
					}
				);
			};

			this.modules.Popups.animations.fadeDown = (popup, immediate, сompleteHandler) => {
				gsap.to(popup, {
					autoAlpha: 0,
					y: 50,
					scale: 0.98,
					display: 'none',
					duration: immediate ? 0 : 0.35,
					onComplete: () => {
						сompleteHandler();
					},
				});
			};
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}
