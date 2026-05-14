(function() {
    // Enquiry Popup - Appears after 20 seconds on every refresh
    
    // Create CSS
    const css = `
        #enquiry-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        #enquiry-modal-overlay.show {
            display: flex;
            opacity: 1;
        }
        #enquiry-modal {
            background: white;
            width: 95%;
            max-width: 450px;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0,0,0,0.3);
            transform: scale(0.8);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-family: 'Outfit', sans-serif;
            position: relative;
            padding: 40px 30px;
        }
        #enquiry-modal-overlay.show #enquiry-modal {
            transform: scale(1);
        }
        .modal-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            color: #aaa;
            cursor: pointer;
            z-index: 10;
        }
        .modal-header-custom {
            text-align: center;
            margin-bottom: 30px;
        }
        .modal-header-custom h3 {
            color: #800000;
            font-weight: 800;
            margin-bottom: 10px;
        }
        .modal-input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            margin-bottom: 15px;
            font-size: 15px;
            transition: 0.3s;
        }
        .modal-input:focus {
            outline: none;
            border-color: #800000;
            background: #fff;
            box-shadow: 0 5px 15px rgba(128, 0, 0, 0.05);
        }
        .btn-submit-enquiry {
            width: 100%;
            padding: 15px;
            background: #800000;
            color: white;
            border: none;
            border-radius: 15px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 10px;
        }
        .btn-submit-enquiry:hover {
            background: #4A0F0F;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(128, 0, 0, 0.2);
        }
        .modal-footer-text {
            text-align: center;
            margin-top: 20px;
            color: #aaa;
            font-size: 12px;
        }
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // Create Modal HTML
    const overlay = document.createElement('div');
    overlay.id = 'enquiry-modal-overlay';
    overlay.innerHTML = `
        <div id="enquiry-modal">
            <button class="modal-close-btn">&times;</button>
            <div class="modal-header-custom">
                <h3>Admission Enquiry</h3>
                <p class="text-muted">Take the first step towards your future.</p>
            </div>
            <form id="simplifiedEnquiryForm">
                <input type="text" id="enqName" class="modal-input" placeholder="Full Name" required>
                <input type="email" id="enqEmail" class="modal-input" placeholder="Email Address" required>
                <input type="tel" id="enqPhone" class="modal-input" placeholder="Phone Number" required>
                <input type="text" id="enqCourse" class="modal-input" placeholder="Course you are looking for?" required>
                <button type="submit" class="btn-submit-enquiry">Send Enquiry Now</button>
            </form>
            <div class="modal-footer-text">
                Our admission counselor will contact you within 24 hours.
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Show modal after delay
    setTimeout(() => {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    }, 20000);

    // Dismissal logic
    const close = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 500);
    };

    overlay.querySelector('.modal-close-btn').onclick = close;

    // Form Submission
    document.getElementById('simplifiedEnquiryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('enqName').value,
            email: document.getElementById('enqEmail').value,
            phone: document.getElementById('enqPhone').value,
            message: `Interested Course: ${document.getElementById('enqCourse').value}`
        };
        
        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const modal = document.getElementById('enquiry-modal');
                modal.innerHTML = `
                    <div style="text-center py-5; text-align:center;">
                        <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
                        <h3 style="color: #800000; font-weight: 800;">Thank You!</h3>
                        <p class="text-muted">Your enquiry has been sent successfully. Our team will get back to you soon.</p>
                        <button onclick="document.getElementById('enquiry-modal-overlay').click()" class="btn-submit-enquiry" style="margin-top:20px;">Close</button>
                    </div>
                `;
                setTimeout(close, 4000);
            }
        } catch (err) {
            alert('Something went wrong. Please try again.');
        }
    });

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) close();
    };
})();
