let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
		}
	});
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { // restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	const id = getParameterByName('id');
	if (!id) { // no id found in URL
		error = 'No restaurant id in URL';
		// if no id show 404 page
		window.location.href = './404.html';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
			self.restaurant = restaurant;
			if (!restaurant) {
				// if restaurant not found show 404 page
				window.location.href = './404.html';
				//console.error(error);
				return;
			}
			fillRestaurantHTML();
			callback(null, restaurant);
		});
	}
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
	document.title = `Restaurant ${restaurant.name} Info`;

	const restaurantContainer = document.getElementById('restaurant-container');

	// create figure
	const figure = document.createElement('figure');
	const figcaption = document.createElement('figcaption');

	// create picture
	const picture = document.createElement('picture');
	// responsive images
	const sourceElement = document.createElement('source');
	sourceElement.setAttribute('media', '(max-width: 800px)');
	sourceElement.setAttribute('srcset', `${DBHelper.imageUrlForRestaurant(restaurant).slice(0,-4)}-small.jpg`);
	picture.append(sourceElement);
	// create image and add it to picture semantics
	const image = document.createElement('img');
	const imgname = DBHelper.imageUrlForRestaurant(restaurant);
	image.className = 'restaurant-img';
	image.setAttribute('alt', `Restaurant ${restaurant.name} picture`);
	image.src = imgname;
	image.setAttribute('tabindex', 0);
	picture.append(image);
	figure.append(picture);

	// add heading
	const heading = document.createElement('h2');
	heading.id = 'restaurant-name';
	heading.innerHTML = restaurant.name;
	heading.setAttribute('tabindex', 0);
	figcaption.append(heading);
	figure.append(figcaption);

	// append figure with figcaption to restaurantContainer
	restaurantContainer.append(figure);

	// create restaurant data section
	const section = document.createElement('section');
	section.id = 'restaurant-data';

	// add cuisine
	const cuisine = document.createElement('p');
	cuisine.id = 'restaurant-cuisine';
	cuisine.innerHTML = restaurant.cuisine_type;
	cuisine.setAttribute('tabindex', 0);
	section.append(cuisine);

	// add address
	const address = document.createElement('p');
	address.id = 'restaurant-address';
	address.innerHTML = restaurant.address;
	address.setAttribute('tabindex', 0);
	section.append(address);

	restaurantContainer.append(section);

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
	const restaurantData = document.getElementById('restaurant-data');
	const hours = document.createElement('table');
	hours.setAttribute('tabindex', 0);
	hours.setAttribute('aria-label', 'Working hours');
	hours.id = 'restaurant-hours';

	for (let key in operatingHours) {
		const row = document.createElement('tr');

		const day = document.createElement('td');
		day.innerHTML = key;
		day.setAttribute('tabindex', 0);
		row.appendChild(day);

		const time = document.createElement('td');
		time.innerHTML = operatingHours[key];
		time.setAttribute('tabindex', 0);
		row.appendChild(time);

		hours.appendChild(row);
	}

	restaurantData.append(hours);
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
	const container = document.getElementById('reviews-container');
	const title = document.createElement('h3');
	title.innerHTML = 'Reviews';
	title.setAttribute('tabindex', 0);
	container.appendChild(title);

	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		noReviews.setAttribute('tabindex', 0);
		container.appendChild(noReviews);
		return;
	}
	const ul = document.getElementById('reviews-list');
	reviews.forEach(review => {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
	const li = document.createElement('li');

	const commentHeader = document.createElement('section');
	commentHeader.className = 'commentHeader';

	const name = document.createElement('p');
	name.innerHTML = review.name;
	name.setAttribute('tabindex', 0);
	commentHeader.appendChild(name);

	const date = document.createElement('p');
	date.innerHTML = review.date;
	date.className = 'commentDate';
	date.setAttribute('tabindex', 0);
	commentHeader.appendChild(date);

	li.appendChild(commentHeader);

	const rating = document.createElement('p');
	rating.innerHTML = `Rating: ${review.rating}`;
	rating.className = 'rating';
	rating.setAttribute('tabindex', 0);
	li.appendChild(rating);

	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	comments.className = 'comment';
	comments.setAttribute('tabindex', 0);
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	li.setAttribute('aria-current', 'page');
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
