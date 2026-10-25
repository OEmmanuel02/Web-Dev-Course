// Editable portfolio links and project content can be centralized here as the site grows.
const portfolio = {
	email: 'eonuoha.dev@gmail.com',
	github: 'https://github.com/OEmmanuel02',
	linkedin: 'https://www.linkedin.com/in/emmanuel-onuoha-2a320b37b/',
	resume: 'Resume.pdf'
};

const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
const closeMenu = () => {
	navLinks.classList.remove('open');
	menuToggle.setAttribute('aria-expanded', 'false');
	menuToggle.setAttribute('aria-label', 'Open navigation');
};

menuToggle.addEventListener('click', () => {
	const open = navLinks.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', open);
	menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') closeMenu();
});

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const revealObserver = new IntersectionObserver(
	(entries) => entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			revealObserver.unobserve(entry.target);
		}
	}),
	{ threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(
	(entries) => entries.forEach((entry) => {
		if (entry.isIntersecting) {
			navLinks.querySelectorAll('a').forEach((link) => {
				link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
			});
		}
	}),
	{ rootMargin: '-35% 0px -55% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));

const form = document.querySelector('#contact-form');
form.addEventListener('submit', (event) => {
	event.preventDefault();
	document.querySelectorAll('.error').forEach((error) => { error.textContent = ''; });
	document.querySelector('#form-status').textContent = '';
	const fields = [
		['name', 'Please enter your name.'],
		['email', 'Please enter a valid email.'],
		['message', 'Please include a message.']
	];
	let valid = true;

	fields.forEach(([id, message]) => {
		const field = document.querySelector('#' + id);
		if (!field.value.trim() || (id === 'email' && !field.validity.valid)) {
			document.querySelector('#' + id + '-error').textContent = message;
			valid = false;
		}
	});

	if (valid) {
		document.querySelector('#form-status').textContent = 'Thanks. The form is ready to connect to an email service or API.';
		form.reset();
	}
});
