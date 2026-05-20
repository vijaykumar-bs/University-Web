(function () {
    const originalFetch = window.fetch.bind(window);
    const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

    const posts = [
        {
            id: 1,
            title: 'Orientation Week 2026 Welcomes New Students',
            content: 'ABC University welcomed its newest batch with campus tours, mentoring circles, student club showcases, and academic readiness sessions.',
            category: 'Campus',
            image_url: img('photo-1523580494863-6f3031224c94'),
            is_upcoming: 1,
            event_date: '2026-06-15',
            view_count: 248
        },
        {
            id: 2,
            title: 'Research Lab Opens for AI and Healthcare Innovation',
            content: 'The new interdisciplinary lab will support student projects in artificial intelligence, diagnostics, wellness, and data-driven healthcare.',
            category: 'Research',
            image_url: img('photo-1581093588401-fbb62a02f120'),
            is_upcoming: 0,
            event_date: '2026-05-28',
            view_count: 196
        },
        {
            id: 3,
            title: 'Industry Connect Summit Announced',
            content: 'Recruiters, alumni, founders, and faculty mentors will meet students for panels, mock interviews, and career planning workshops.',
            category: 'Placements',
            image_url: img('photo-1556761175-b413da4baf72'),
            is_upcoming: 1,
            event_date: '2026-07-05',
            view_count: 312
        }
    ];

    const faculties = [
        {
            id: 1,
            name: 'Dr. Ananya Rao',
            designation: 'Professor',
            department: 'Computer Science',
            image_url: img('photo-1494790108377-be9c29b29330')
        },
        {
            id: 2,
            name: 'Prof. Rohan Mehta',
            designation: 'Associate Professor',
            department: 'Commerce and Management',
            image_url: img('photo-1507003211169-0a1dd7228f2d')
        },
        {
            id: 3,
            name: 'Dr. Meera Iyer',
            designation: 'Dean',
            department: 'Allied Healthcare',
            image_url: img('photo-1551836022-d5d88e9218df')
        },
        {
            id: 4,
            name: 'Dr. Karthik Nair',
            designation: 'Assistant Professor',
            department: 'Yoga and Humanities',
            image_url: img('photo-1500648767791-00dcc994a43e')
        }
    ];

    const courses = [
        { id: 1, name: 'B.Tech Computer Science', department: 'Engineering', duration: '4 Years', description: 'Programming, AI, cloud, data systems, and full-stack development.' },
        { id: 2, name: 'BBA Business Analytics', department: 'Management', duration: '3 Years', description: 'Business strategy, analytics, finance, marketing, and leadership.' },
        { id: 3, name: 'B.Sc Nursing', department: 'Healthcare', duration: '4 Years', description: 'Clinical practice, community health, patient care, and medical ethics.' },
        { id: 4, name: 'M.Sc Yoga Therapy', department: 'Wellness', duration: '2 Years', description: 'Evidence-based yoga therapy, research methods, and integrative wellness.' }
    ];

    const reviews = [
        {
            id: 1,
            student_name: 'Arjun Mehta',
            rating: 5,
            comment: 'The faculty members are supportive and the campus environment helped me grow with confidence.',
            status: 'Approved',
            image_url: img('photo-1506794778202-cad84cf45f1d')
        },
        {
            id: 2,
            student_name: 'Sneha Rao',
            rating: 5,
            comment: 'Great classrooms, practical projects, and placement training from the first year itself.',
            status: 'Approved',
            image_url: img('photo-1534528741775-53994a69daeb')
        },
        {
            id: 3,
            student_name: 'Vikram Singh',
            rating: 4,
            comment: 'A balanced place for academics, sports, cultural clubs, and career preparation.',
            status: 'Approved',
            image_url: img('photo-1506794778202-cad84cf45f1d')
        }
    ];

    const placementStories = [
        {
            id: 1,
            student_name: 'Priya Sharma',
            course: 'B.Tech Computer Science',
            company: 'Infosys',
            package: '8 LPA',
            story: 'Project labs and mock interviews helped me prepare for every round with clarity.',
            status: 'Approved',
            image_url: img('photo-1531123897727-8f129e1688ce')
        },
        {
            id: 2,
            student_name: 'Rahul Nambiar',
            course: 'BBA Business Analytics',
            company: 'Deloitte',
            package: '7.2 LPA',
            story: 'The placement cell guided me on resume building, aptitude practice, and case interviews.',
            status: 'Approved',
            image_url: img('photo-1506794778202-cad84cf45f1d')
        }
    ];

    const applications = [
        { id: 1, first_name: 'Aditi', last_name: 'Kumar', email: 'aditi@example.com', phone: '9876543210', course: 'B.Tech Computer Science', status: 'Pending', created_at: '2026-05-12' },
        { id: 2, first_name: 'Nikhil', last_name: 'Gowda', email: 'nikhil@example.com', phone: '9876501234', course: 'BBA Business Analytics', status: 'Approved', created_at: '2026-05-14' }
    ];

    const enquiries = [
        { id: 1, name: 'Ramesh Kumar', email: 'ramesh@example.com', phone: '9988776655', message: 'Please share admission details for B.Tech.', created_at: '2026-05-10' },
        { id: 2, name: 'Lakshmi N', email: 'lakshmi@example.com', phone: '8877665544', message: 'I want to know hostel and scholarship details.', created_at: '2026-05-11' }
    ];

    function json(data, status = 200) {
        return Promise.resolve(new Response(JSON.stringify(data), {
            status,
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    function pathOf(input) {
        const raw = typeof input === 'string' ? input : input.url;
        const url = new URL(raw, window.location.href);
        return { url, path: url.pathname.substring(url.pathname.indexOf('/api')) };
    }

    window.fetch = function (input, init = {}) {
        const method = (init.method || (input && input.method) || 'GET').toUpperCase();
        const { url, path } = pathOf(input);

        if (!path.startsWith('/api')) {
            return originalFetch(input, init);
        }

        if (path === '/api/login') {
            return json({ token: 'static-demo-token' });
        }

        if (method !== 'GET') {
            return json({ message: 'Submitted successfully', id: Date.now() });
        }

        if (path === '/api/posts') {
            let data = posts.slice();
            if (url.searchParams.get('is_upcoming') === '1') {
                data = data.filter((post) => Number(post.is_upcoming) === 1);
            }
            if (url.searchParams.has('limit')) {
                data = data.slice(0, Number(url.searchParams.get('limit')));
            }
            return json(data);
        }

        if (path.startsWith('/api/posts/')) {
            const id = Number(path.split('/').pop());
            return json(posts.find((post) => post.id === id) || posts[0]);
        }

        if (path === '/api/faculties') return json(faculties);
        if (path === '/api/courses') return json(courses);
        if (path === '/api/reviews') return json(reviews);
        if (path === '/api/placement-stories') return json(placementStories);
        if (path === '/api/applications') return json(applications);
        if (path === '/api/enquiries') return json(enquiries);

        return json({ message: 'Static demo response' });
    };
})();
