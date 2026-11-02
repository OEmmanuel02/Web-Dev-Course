// Editable portfolio links and project content can be centralized here as the site grows.
const portfolio = {
	email: 'eonuoha.dev@gmail.com',
	github: 'https://github.com/OEmmanuel02',
	linkedin: 'https://www.linkedin.com/in/emmanuel-onuoha-2a320b37b/',
	resume: 'Resume.pdf'
};

const themeToggle = document.querySelector('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const applyTheme = (theme) => {
	const light = theme === 'light';
	document.documentElement.dataset.theme = theme;
	themeToggle.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
	themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
	themeToggle.title = `Switch to ${light ? 'dark' : 'light'} theme`;
	themeColor.setAttribute('content', light ? '#f5f8f6' : '#0b0d0d');
};

try {
	const savedTheme = localStorage.getItem('portfolio-theme');
	if (savedTheme === 'light' || savedTheme === 'dark') applyTheme(savedTheme);
} catch (error) {
	console.warn('Unable to read the saved theme preference.', error);
}

themeToggle.addEventListener('click', () => {
	const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
	applyTheme(nextTheme);
	try {
		localStorage.setItem('portfolio-theme', nextTheme);
	} catch (error) {
		console.warn('Unable to save the theme preference.', error);
	}
});

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
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	document.querySelectorAll('.error').forEach((error) => { error.textContent = ''; });
	formStatus.textContent = '';
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
		submitButton.disabled = true;
		formStatus.textContent = 'Sending your message…';

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: new FormData(form),
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) {
				throw new Error(`Formspree returned ${response.status}`);
			}

			formStatus.textContent = 'Thanks for your message. I’ll be in touch soon.';
			form.reset();
		} catch (error) {
			console.error('Unable to send contact form submission.', error);
			formStatus.textContent = 'Sorry, your message could not be sent. Please try again or email eonuoha.dev@gmail.com.';
		} finally {
			submitButton.disabled = false;
		}
	}
});
