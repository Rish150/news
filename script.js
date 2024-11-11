document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0;
    const numSlides = 4;
    let slideInterval;  // To store the interval ID

    function showSlides() {
        const slides = document.getElementsByClassName("slidepicture");
        const dots = document.getElementsByClassName("dot");

        if (slideIndex >= numSlides) slideIndex = 0;
        if (slideIndex < 0) slideIndex = numSlides - 1;

        for (let i = 0; i < numSlides; i++) {
            slides[i].style.display = "none";
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex].style.display = "block";
        if (dots[slideIndex]) dots[slideIndex].className += " active";

        slideIndex++;
    }

    const newsContainer = document.getElementById('news-container');
    const carouselContainer = document.querySelector('.slideshow-container');
    const dotsContainer = document.querySelector('.dots');
    const apiKey = "1e3a1989b8744e30a46ce38aebb29c44";
    const baseUrl = "https://newsapi.org/v2/";

    function fetchNews(endpoint) {
        // Clear previous interval
        if (slideInterval) clearInterval(slideInterval);

        // Clear previous content before fetching new news
        newsContainer.innerHTML = '';  // Clear all previous news articles
        carouselContainer.innerHTML = '';  // Clear carousel
        dotsContainer.innerHTML = '';  // Clear dots

        fetch(`${baseUrl}${endpoint}&apiKey=${apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (!data.articles.length) throw new Error('No articles available');

                displayArticles(data.articles);
                // Call showSlides only after articles have been displayed
                showSlides();
                // Set interval only after the slides are initialized
                slideInterval = setInterval(showSlides, 5000);
            })
            .catch(error => {
                console.error('Error loading news:', error);
                // Handle error (optional)
            });
    }

    function displayArticles(articles) {
        // Filter out articles without images
        const filteredArticles = articles.filter(article => article.urlToImage);

        // Create slides for the carousel
        filteredArticles.slice(0, numSlides).forEach((article, index) => {
            const slideElement = document.createElement('div');
            slideElement.classList.add('slidepicture');
            slideElement.onclick = () => window.open(article.url, '_blank');

            slideElement.innerHTML = `
                <img src="${article.urlToImage}" alt="${article.title}" style="width: 100%; pointer-events: auto;">
                <div class="caption">${article.title}</div>
            `;

            carouselContainer.appendChild(slideElement);

            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.onclick = () => showSlides(slideIndex = index);
            dotsContainer.appendChild(dot);
        });

        // Display the full articles below the carousel
        filteredArticles.slice(numSlides).forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-article');
            articleElement.innerHTML = `
                <div id="alldata">
                    <div class="news">
                        <img src="${article.urlToImage}" alt="${article.title}">
                        <h2>${article.title}</h2>
                        <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                </div>
            `;
            newsContainer.appendChild(articleElement);
        });
    }

    // Category filtering based on user selection
    function filterNews(category) {
        const categoryMap = {
            automobile: "top-headlines?category=automobile",
            tech: "top-headlines?category=technology",
            business: "top-headlines?category=business",
            sports: "top-headlines?category=sports",
            health: "top-headlines?category=health",
            latest: "top-headlines",
            all: "top-headlines?sources=bbc-news"
        };

        const endpoint = categoryMap[category] || categoryMap['latest']; // Default to 'latest' if category is unknown
        fetchNews(endpoint);
    }

    // Fetch default news on page load
    fetchNews("top-headlines?sources=bbc-news");

    // Event listeners for category filtering
    document.querySelectorAll('.navbar a[data-category]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.getAttribute('data-category');
            filterNews(category);
        });
    });

    // Event listener for "Home" link
    const homeLink = document.querySelector('.navbar a[data-category="home"]');
    if (homeLink) {
        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            fetchNews("top-headlines?sources=bbc-news");  // Fetch the default news feed
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('#search button');

    // Search functionality when pressing Enter or clicking the button
    function searchNews() {
        const query = searchInput.value.trim();
        if (query) fetchNews(`everything?q=${encodeURIComponent(query)}`);
    }

    // Listen for Enter key press
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchNews();
        }
    });

    // Listen for button click
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        searchNews();
    });
});
