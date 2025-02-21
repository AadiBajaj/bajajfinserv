import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields.');
            return;
        }
        setSuccessMessage('Message sent successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #12123b, #1f1f5b)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Contact Our Fitness Experts</h2>
                <p className="text-center text-gray-600 mb-4">Have questions about your fitness journey? Reach out to us!</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div>
                        <label className="block font-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div>
                        <label className="block font-medium">Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="4" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Submit</button>
                </form>
                {successMessage && <p className="text-green-600 text-center mt-3">{successMessage}</p>}
            </div>
        </div>
    );
}
