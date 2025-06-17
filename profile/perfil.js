const btnProfile = document.getElementById('btn-profile');
const profile = document.querySelector('.profile');

btnProfile.addEventListener('click', () => {
    btnProfile.style.display = 'none';
    profile.style.display = 'flex';
})

const btnCloseProfile = document.getElementById('btn-close-profile');

btnCloseProfile.addEventListener('click', () => {
    profile.style.display = 'none';
    btnProfile.style.display = 'block';
})