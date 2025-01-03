
/* General reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body styling */
body {
    font-family: Arial, sans-serif;
    background-color: #000;
    color: #fff;
    line-height: 1.6;
    margin: 0;
    overflow-x: hidden; /* Prevent horizontal scroll caused by any overflow */
}

/* Hero Section */
.hero-section {
    position: relative;
    min-height: 100vh; /* Ensure it spans the full viewport height */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 60%, #000),
                url('bg-image.jpg') no-repeat center center/cover;
    background-size: cover; /* Fill the container */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    width: 100%; /* Default full width for hero */
}

.hero-content {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    padding: 0 1rem;
}

.title {
    font-size: 4rem;
    font-weight: bold;
    line-height: 1.1;
    margin-bottom: 1rem;
}

.subtitle {
    font-size: 1.4rem;
    margin-top: 1rem;
}

/* Rankings Table Section */
.rankings-section {
    width: 100%; /* Full width */
    margin: 4rem auto;
    padding: 0 1rem; /* Maintain black space around the table */
}

.rankings-table {
    width: 100%; /* Default full width for table */
    border-collapse: collapse;
    background-color: #111;
    color: #ddd;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    overflow: hidden;
    margin: 0 auto; /* Center the table */
}

.rankings-table thead {
    background-color: #1b1b1b;
    color: #ffffff; /* Updated to bright white */
    text-transform: uppercase;
    font-weight: bold;
}

.rankings-table th {
    padding: 1rem;
    text-align: center;
    border-bottom: 2px solid #333;
}

.rankings-table td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #222;
}

.rankings-table tr:nth-child(even) {
    background-color: #181818;
}

.rankings-table tr:hover {
    background-color: #222;
    transition: background-color 0.3s ease;
}

/* Avatar Column Styling */
.avatar-cell {
    text-align: center;
    vertical-align: middle; /* Center vertically in the cell */
}

/* Avatar Image Styling */
.avatar-img {
    width: 50px; /* Set width for avatar */
    height: 50px; /* Set height for avatar */
    border-radius: 50%; /* Make avatar circular */
    object-fit: cover; /* Ensure image scales properly */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Optional shadow for a polished look */
    margin: auto; /* Center image inside the cell */
}

/* Media Query for iPhone 15 */
@media (max-width: 768px) {
    .hero-section {
        min-height: 100vh;
        width: calc(100% + 0.5rem); /* Reset to default */
        margin: 0 auto;
        padding: 0;
    }
    .title {
        font-size: 2.5rem;
    }
    .subtitle {
        font-size: 1rem;
    }
    .rankings-section {
        margin: 2rem auto;
        padding: 0.5rem;
    }
    .rankings-table {
        width: 100%; /* Reset to default */
    }
    .rankings-table th, .rankings-table td {
        padding: 0.5rem;
        font-size: 0.9rem;
    }
}

/* Media Query for Redmi Note 9 */
@media (max-width: 393px) {
    .hero-section {
        min-height: 100vh;
        width: calc(100% + 6rem); /* Reset to default */
        margin: 0 auto;
        padding: 0;
    }
    .title {
        font-size: 2.3rem;
    }
    .subtitle {
        font-size: 0.9rem;
    }
    .rankings-section {
        margin: 1.5rem auto;
        padding: 0.5rem;
    }
    .rankings-table {
        width: 100%; /* Reset to default */
    }
    .rankings-table th, .rankings-table td {
        padding: 0.4rem;
        font-size: 0.8rem;
    }
}
