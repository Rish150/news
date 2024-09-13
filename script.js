document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0;
    const numSlides = 4; // Number of slides to show

    // Function to show a specific slide
    function showSlides() {
        const slides = document.getElementsByClassName("slidepicture");
        const dots = document.getElementsByClassName("dot");

        // Reset slideIndex if it exceeds the number of slides
        if (slideIndex >= numSlides) {
            slideIndex = 0;
        }
        if (slideIndex < 0) {
            slideIndex = numSlides - 1;
        }

        // Hide all slides and remove active class from dots
        for (let i = 0; i < numSlides; i++) {
            slides[i].style.display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        // Display the current slide and set the active dot
        slides[slideIndex].style.display = "block";
        if (dots[slideIndex]) {
            dots[slideIndex].className += " active";
        }

        slideIndex++;
    }

    // Fetch and display news data
    fetch("https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=1e3a1989b8744e30a46ce38aebb29c44")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const articles = data.articles;
            const newsContainer = document.getElementById('news-container');
            const carouselContainer = document.querySelector('.slideshow-container');
            const dotsContainer = document.querySelector('.dots');

            // Create carousel slides and dots
            articles.slice(0, numSlides).forEach((article, index) => {
                const slideElement = document.createElement('div');
                slideElement.classList.add('slidepicture', 'fade');

                slideElement.innerHTML = `
                    <img src="${article.urlToImage}" alt="${article.title}">
                    <div class="caption">${article.title}</div>
                `;

                carouselContainer.appendChild(slideElement);

                // Create a dot for each slide
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.onclick = () => showSlides(slideIndex = index);
                dotsContainer.appendChild(dot);
            });

            // Add news articles to the grid
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

            // Initialize the carousel
            showSlides();
            setInterval(showSlides, 5000); // Change slide every 5 seconds
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

