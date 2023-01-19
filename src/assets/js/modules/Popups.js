import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Signal from '../classes/Signal';

const HTML_CLASSLIST = document.documentElement.classList;

class Popups {
	constructor() {
		this.init();
	}

	init() {
		this.wrapper = document.querySelector('[data-popups]');

		if (!this.wrapper) {
			return;
		}

		this.onOpen = new Signal();
		this.onClose = new Signal();
		this.onCloseStart = new Signal();

		this.opened = false;
		this.openedClass = '';

		this.activePopup = null;
		this.activePopupName = '';
		this.popups = document.querySelectorAll('[data-popup]');

		Array.from(document.querySelectorAll('[data-popup-opener]')).forEach(element => {
			element.addEventListener('click', e => {
				e.preventDefault();

				this.open(e.currentTarget.getAttribute('data-popup-opener'));
			});
		});

		Array.from(document.querySelectorAll('[data-popup-closer]')).forEach(element => {
			element.addEventListener('click', e => {
				e.preventDefault();

				this.close();
			});
		});

		window.addEventListener('keydown', e => {
			if (this.opened && e.key === 'Escape') {
				this.close();
			}
		});

		this.wrapper.addEventListener('click', e => {
			if (this.opened) {
				if (e.target === this.wrapper) {
					this.close();
				}
			}
		});
	}
	open(name) {
		if (this.activePopupName === name) {
			return;
		}

		if (this.opened) {
			this.close(true);
		}

		const popup = this.wrapper.querySelector('[data-popup="' + name + '"]');

		if (!popup) {
			console.log('No popup for ' + name + ' opener');
			return;
		}

		this.opened = true;
		this.activePopup = popup;
		this.activePopupName = name;

		this.wrapper.classList.add('_' + name);

		this.wrapper.classList.remove('no-pe');
		gsap.to(this.wrapper, {
			duration: 0.35,
			autoAlpha: 1,
			overwrite: true,
			display: 'flex',
		});
		gsap.fromTo(
			this.activePopup,
			{ autoAlpha: 0, scale: 0.98, display: 'block' },
			{
				duration: 0.35,
				autoAlpha: 1,
				scale: 1,
				onComplete: () => {
					const focusElement = this.activePopup.querySelector('[data-popup-focus]');

					if (focusElement) {
						focusElement.focus && focusElement.focus();
					}
				},
			}
		);

		HTML_CLASSLIST.add('_popup-opened');

		this.openedClass = '_popup-opened-' + name;
		HTML_CLASSLIST.add(this.openedClass);

		disableBodyScroll(this.activePopup);

		this.onOpen.call();
	}
	close(immediate = false) {
		if (this.opened) {
			this.opened = false;

			this.wrapper.classList.remove('_' + this.activePopupName);

			this.onCloseStart.call(this.activePopupName);

			this.activePopupName = '';

			this.wrapper.classList.add('no-pe');
			gsap.to(this.wrapper, 0.35, { duration: 0.35, autoAlpha: 0, display: 'none' });
			gsap.to(this.activePopup, {
				duration: immediate ? 0 : 0.35,
				autoAlpha: 0,
				scale: 0.98,
				display: 'none',
				onComplete: () => {
					enableBodyScroll(this.activePopup);
					this.onClose.call();
				},
			});

			HTML_CLASSLIST.remove('_popup-opened');

			if (this.openedClass !== '') {
				HTML_CLASSLIST.remove(this.openedClass);
				this.openedClass = '';
			}
		}
	}
	getPopup(name) {
		return this.wrapper.querySelector('[data-popup="' + name + '"]');
	}
}

export default new Popups();
