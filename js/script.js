// burger-menu
const burgerButton = document.querySelector('.burger-menu'),
	headerMenu = document.querySelector('.mobile-menu-actions');


if (burgerButton) {
	burgerButton.addEventListener('click', toggleMenu);

	function toggleMenu(e) {

		burgerButton.classList.toggle('_active')
		headerMenu.classList.toggle('_active')
		document.body.classList.toggle('_lock');
	}

}
const switcherTheme = document.querySelector('[data-theme]');


if (switcherTheme) {
	switcherTheme.addEventListener('click', (e) => {
		switcherTheme.classList.toggle('_active')
		document.documentElement.classList.toggle('dark-theme')

		let mode = switcherTheme.dataset.theme
		mode === 'light-mode' ? mode = 'dark-mode' : mode = 'light-mode'
		console.log(mode);
		switcherTheme.dataset.theme = mode

		localStorage.setItem('lookupTheme', mode)
		console.log(localStorage.getItem('lookupTheme'));
	})


	let activeTheme = localStorage.getItem('lookupTheme')

	console.log(localStorage.getItem('lookupTheme'));


	if (activeTheme === "light-mode") {
		switcherTheme.classList.remove('_active')
		document.documentElement.classList.remove('dark-theme')
		switcherTheme.dataset.theme = "light-mode"
		
	} else if (activeTheme === "dark-mode") {
		switcherTheme.classList.add('_active')
		document.documentElement.classList.add('dark-theme')

		switcherTheme.dataset.theme = "dark-mode"
	}


}


// spollers function

function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(',')[0];
		});

		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}
	}

	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(',')[0];
	});



	if (spollersMedia.length > 0) {

		const breakpoinsArray = [];
		spollersMedia.forEach((item) => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(',');
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
			breakpoint.item = item;
			breakpoinsArray.push(breakpoint);
		});

		let mediaQueries = breakpoinsArray.map((item) => {
			return '(' + item.type + "-width: " + item.value + 'px),' + item.value + ',' + item.type;
		});

		mediaQueries = mediaQueries.filter((item, index, self) => {
			return self.indexOf(item) === index;
		});

		mediaQueries.forEach((breakpoint) => {
			const paramsArray = breakpoint.split(',');
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spollersArray = breakpoinsArray.filter((item) => {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			matchMedia.addEventListener("change", function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}

	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach((spollersBlock) => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click', setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction)
			}
		});
	}

	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			})
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollerBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();

		}
	}

	function hideSpollerBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}


	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);

		}
	}

	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);

		}
	}

	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			_slideUp(target, duration);
		}
	}
}

spollers()

// dropdown Menu function
function selectMenu() {
	const selects = document.querySelectorAll('[data-select-menu]');

	// data-select-menu main data-atribute
	// data-select-menu-button open close dropdown menu
	// data-select-menu-value value of data-select-menu-button
	// data-select-menu-drop-down body of dropdown menu
	// data-select-menu-option options of dropdown menu

	if (selects) {

		document.documentElement.addEventListener('click', collapseSelects)

		selects.forEach(select => {

			const selectButton = select.querySelector('[data-select-menu-button]');
			const selectOptions = select.querySelectorAll('[data-select-menu-option]');

			selectButton.addEventListener('click', selectToggle)
			selectOptions.forEach(el => {
				el.addEventListener('click', selectChoose)
			});
		});



		function selectToggle(e) {
			const parent = e.target.closest('[data-select-menu]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]');
			parent.classList.toggle('_active')
			_slideToggle(selectBody, 300)
		}

		function selectChoose(e) {
			const parent = e.target.closest('[data-select-menu]'),
				selectValue = parent.querySelector('[data-select-menu-value]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]');
			let valueItem = this.innerText;
			selectValue.innerHTML = valueItem;
			parent.classList.remove('_active')
			_slideUp(selectBody, 300)
		}

		function collapseSelects(e) {
			const targetClick = e.target.closest('[data-select-menu]')
			selects.forEach(select => {
				if (!targetClick || targetClick !== select) {
					select.classList.remove('_active')
					const selectBody = select.querySelector('[data-select-menu-drop-down]');
					_slideUp(selectBody, 300)
				}
			});

		}

		let _slideUp = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = target.offsetHeight + 'px';
				target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				window.setTimeout(() => {
					target.style.display = 'none';
					target.style.removeProperty('height');
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}
		}

		let _slideDown = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.removeProperty('display');
				let display = window.getComputedStyle(target).display;
				if (display === 'none')
					display = 'block'

				target.style.display = display;
				let height = target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				target.offsetHeight;
				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = height + 'px';
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				window.setTimeout(() => {
					target.style.removeProperty('height');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}

		}

		let _slideToggle = (target, duration = 500) => {
			if (window.getComputedStyle(target).display === 'none') {
				return _slideDown(target, duration);
			} else {
				_slideUp(target, duration);
			}
		}
	}


}

selectMenu()


// tabs function

function filterFunction() {
	const filters = document.querySelectorAll('[data-filter]');

	if (filters) {
		filters.forEach(filter => {
			const filterButtons = filter.querySelectorAll('[data-filter-category]');

			filterButtons.forEach(filterButton => {




				filterButton.addEventListener('click', (e) => {
					let filterSections = filter.querySelectorAll('[data-filter-content]')
					filterSections.forEach(filterSection => {
						if (filterSection.classList.contains('_show')) {
							filterSection.classList.remove('_show')
						}
						if (filterSection.classList.contains('_last-child')) {
							filterSection.classList.remove('_last-child')
						}

					});

					filterButtons.forEach(filterButton => {
						if (filterButton.classList.contains('_active')) {
							filterButton.classList.remove('_active')
						}
					});

					let seflButton = e.target,
						buttonId = seflButton.dataset.filterCategory

					if (buttonId === 'all') {
						filterSections.forEach((filterSection, index) => {
							filterSection.classList.add('_show')
							if (index === filterSections.length - 1) {
								filterSection.classList.add('_last-child')
							}
						});

					} else {
						const sectionsWithRightCategory = document.querySelectorAll(`[data-filter-content="${buttonId}"]`)

						sectionsWithRightCategory.forEach((sectionWithRightCategory, index) => {
							sectionWithRightCategory.classList.add('_show')
							if (index === sectionsWithRightCategory.length - 1) {
								sectionWithRightCategory.classList.add('_last-child')
							}
						});
					}

					seflButton.classList.add('_active')

					decorSwitcher(seflButton)
				})
			});


		});
	}

}
filterFunction()
// switcher to tabs
function decorSwitcher(currentActiveButton) {
	if (currentActiveButton) {
		const parentElement = currentActiveButton.closest('[data-filter]');
		const filterDecor = parentElement.querySelector('[data-filter-decor]');
		let decorLeftPosition = currentActiveButton.offsetLeft,
			decorWidth = currentActiveButton.offsetWidth
		filterDecor.style.left = `${decorLeftPosition}px`
		filterDecor.style.width = `${decorWidth}px`
	}
}

const activeCategory = document.querySelector('[data-filter-category]._active');
if (activeCategory) {

	decorSwitcher(activeCategory)



	window.addEventListener('resize', (e) => {
		const activeCategory = document.querySelector('[data-filter-category]._active');

		decorSwitcher(activeCategory)
	})

}

const passwordWrappers = document.querySelectorAll('[data-pass]');

if (passwordWrappers) {
	passwordWrappers.forEach(passwordWrapper => {
		const input = passwordWrapper.querySelector('[data-pass-input]'),
			button = passwordWrapper.querySelector('[data-pass-button]');
		button.addEventListener('click', (e) => {
			button.classList.toggle('_invisible')
			input.type === 'text' ? input.type = 'password' : input.type = 'text'
		})
	});
}

function gridInit() {
	const items = document.querySelector('.search-stats__items');
	if (items) {
		const itemsGrid = new Masonry(items, {
			itemSelector: '.search-stats__item',
			// columnWidth: 488,
			fitWidth: true,
			gutter: 28,
		})
	}
}
function gridInitTwo() {
	const items = document.querySelector('.search-results-gallery__items');
	if (items) {
		let msnry = new Masonry(items, {
			columnWidth: 1,
			itemSelector: '.search-results-gallery__item',
			fitWidth: true,
			gutter: 15,
		})

		imagesLoaded(items).on('progress', function () {
			// layout Masonry after each image loads
			msnry.layout();
		});
	}
}


window.addEventListener('load', (e) => {
	gridInit()
	gridInitTwo()

})



// swiper search result page
const swiperTimelineWrapper = document.querySelector('.search-timeline__swiper');
let swiperTimeline;

try {

	swiperTimeline = new Swiper(swiperTimelineWrapper, {
		slidesPerView: 'auto',
		enabled: false,
		breakpoints: {
			768: {
				enabled: true,
			}
		},
		navigation: {
			nextEl: '.search-timeline__next',
			prevEl: '.search-timeline__prev',
		},
	});

}
catch (e) { }




function dropDown() {
	const dropDownsItems = document.querySelectorAll('[data-drop-down]');

	if (dropDownsItems) {
		dropDownsItems.forEach(dropDownsItem => {
			const button = document.querySelector('[data-drop-down-button]'),
				body = document.querySelector('[data-drop-down-body]');

			button.addEventListener('click', (e) => {
				body.classList.toggle('_active');
			})

			document.documentElement.addEventListener('click', collapseSelects)

			function collapseSelects(e) {
				const targetClick = e.target.closest('[data-drop-down]')
				dropDownsItems.forEach(dropDownsItem => {
					if (!targetClick || targetClick !== dropDownsItem) {
						dropDownsItem.classList.remove('_active')
						const body = dropDownsItem.querySelector('[data-drop-down-body]');
						body.classList.remove('_active')
					}
				});

			}
		});
	}
}

dropDown()