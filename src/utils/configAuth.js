const authEndpoint = `https://accounts.spotify.com/authorize`;

const scopes = [
    'user-read-private',
    'user-top-read',
    'playlist-modify-private',
    'playlist-modify-public'
];

export const getAuthorizeHref = () => {
    const clientID = process.env.REACT_APP_CLIENT_ID;
    const redirectURI = process.env.REACT_APP_REDIRECT_URI;
    return `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token`
}