// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully!');
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Function to load projects dynamically
function loadProjects() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    const projects = [
        {
            title: 'Project 1',
            description: 'Description of your first project',
            tags: ['Tag1', 'Tag2']
        },
        {
            title: 'Project 2',
            description: 'Description of your second project',
            tags: ['Tag3', 'Tag4']
        }
    ];

    projectGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Load projects when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
} else {
    loadProjects();
}