document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0;
    const numSlides = 4;

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
    const apiKey = "1e3a1989b8744e30a46ce38aebb29c44";
    const baseUrl = "https://newsapi.org/v2/";

    function fetchNews(endpoint) {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        
        fetch(`${baseUrl}${endpoint}&apiKey=${apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (!data.articles.length) throw new Error('No articles available');
                
                displayArticles(data.articles);
                showSlides();
                setInterval(showSlides, 5000);
            })
            .catch(error => {
                newsContainer.innerHTML = `<p>Error loading news: ${error.message}</p>`;
            });
    }

    function displayArticles(articles) {
        const carouselContainer = document.querySelector('.slideshow-container');
        const dotsContainer = document.querySelector('.dots');
        newsContainer.innerHTML = ''; // Clear previous articles

        articles.slice(0, numSlides).forEach((article, index) => {
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

        articles.slice(numSlides).forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-article');
            articleElement.innerHTML = `
                <div id="alldata">
                    <div class="news">
                        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}">` : ''}
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

    fetchNews("top-headlines?sources=bbc-news");

    // Search bar functionality
    document.querySelector('#search input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = event.target.value.trim();
            if (query) fetchNews(`everything?q=${encodeURIComponent(query)}`);
        }
    });
});
