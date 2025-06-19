 // Toggle sidebar on mobile
        document.querySelector('.menu-toggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Active navigation link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Simulate adding a new member
        document.querySelector('.btn').addEventListener('click', function() {
            alert('Add Member form would open here');
        });

        // Simulate edit and delete actions
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const memberName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
                alert(`Edit member: ${memberName}`);
            });
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const memberName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
                if(confirm(`Are you sure you want to delete ${memberName}?`)) {
                    alert(`${memberName} has been deleted`);
                }
            });
        });

        // Module cards click events
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('click', function() {
                const moduleName = this.querySelector('h3').textContent;
                alert(`Opening ${moduleName} module`);
            });
        });