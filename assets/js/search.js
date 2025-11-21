// Advanced search functionality for Tulga
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const authorsGrid = document.getElementById('authors-grid');
    
    if (!searchInput) return;

    let searchData = [];
    let originalContent = '';

    // Load search data
    fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
            console.log('Search data loaded:', searchData.length, 'items');
        })
        .catch(error => {
            console.error('Error loading search data:', error);
            // Fallback to simple author search
            setupSimpleSearch();
        });

    // Save original content
    if (authorsGrid) {
        originalContent = authorsGrid.innerHTML;
    }

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            // Restore original content
            if (authorsGrid && originalContent) {
                authorsGrid.innerHTML = originalContent;
            }
            return;
        }

        if (query.length < 2) return; // Wait for at least 2 characters

        // Search in data
        const results = searchData.filter(item => {
            const searchText = `
                ${item.name || ''} 
                ${item.title || ''} 
                ${item.author || ''} 
                ${item.excerpt || ''} 
                ${item.genre || ''} 
                ${item.content || ''}
            `.toLowerCase();
            
            return searchText.includes(query);
        });

        displayResults(results);
    });

    function displayResults(results) {
        if (!authorsGrid) return;

        if (results.length === 0) {
            authorsGrid.innerHTML = '<p style="text-align: center; color: #666;">Hech narsa topilmadi</p>';
            return;
        }

        let html = '';
        results.forEach(item => {
            if (item.type === 'author') {
                html += `
                    <a href="${item.url}" class="author-card">
                        <h3>${item.name}</h3>
                        ${item.birth || item.death ? `<p class="dates">${item.birth || ''}${item.death ? ' - ' + item.death : ''}</p>` : ''}
                        ${item.excerpt ? `<p class="excerpt">${item.excerpt}</p>` : ''}
                    </a>
                `;
            } else if (item.type === 'work') {
                html += `
                    <a href="${item.url}" class="author-card">
                        <h3>${item.title}</h3>
                        <p class="dates">${item.author}${item.year ? ' • ' + item.year : ''}</p>
                        ${item.genre ? `<p class="excerpt">${item.genre}</p>` : ''}
                    </a>
                `;
            }
        });

        authorsGrid.innerHTML = html;
    }

    // Fallback simple search for author cards only
    function setupSimpleSearch() {
        const authorCards = document.querySelectorAll('.author-card');
        
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();

            if (query.length === 0) {
                authorCards.forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }

            authorCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'block' : 'none';
            });
        });
    }
});