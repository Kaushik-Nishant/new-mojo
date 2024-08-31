import React, { useState, useEffect } from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import Card from './card'; // Ensure the Card component is correctly imported

function GetPages() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [pageStats, setPageStats] = useState(null);

  // Hardcoded access token
  const accessToken = 'EAAe4Wr60ZCXUBOZCG0u2ZBFPZB3imBKSVDykWBoB9Yx0Om38WNuUiAamzdPuHMlWiGgyXIXxrqmnoB5H2hJxDzjFGqV0oZBCBpbla3C1dVEOXdJRHNvTzA4QLKZAZA9b4qjBFAK13hn2HyLXNo0DpqUC0Nj5ybyaxAKXYXcideVwUNIE4C0kzzWqY6b5c3agZAqwRJRaQrbZCwURk7ZBTLfQZDZD';

  // Fetch the list of pages the user manages
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("https://graph.facebook.com/me/accounts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        const data = await response.json();

        if (response.ok && data && data.data) {
          setPages(data.data);
        } else {
          console.error("Error fetching pages:", data.error);
          alert("Error fetching pages. Check your permissions and access token.");
        }
      } catch (error) {
        console.error("Error in fetch:", error);
        alert("Network error. Please check your connection and try again.");
      }
    };

    fetchPages();
  }, [accessToken]);

  // Fetch stats for the selected page
  useEffect(() => {
    if (!selectedPage) return;

    const fetchPageStats = async () => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/${selectedPage}?fields=fan_count,engagement`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          }
        );
        const data = await response.json();

        if (response.ok && data) {
          setPageStats({
            followers: data.fan_count || 0,
            engagement: data.engagement ? data.engagement.count : 0,
          });
        } else {
          console.error("Error fetching page stats:", data.error);
          alert("Error fetching page stats. Check if the page has sufficient data.");
        }
      } catch (error) {
        console.error("Error in fetch:", error);
        alert("Network error while fetching page stats. Please try again.");
      }
    };

    fetchPageStats();
  }, [selectedPage, accessToken]);

  return (
    <div style={{ marginTop: '20px' }}>
      <select
        value={selectedPage}
        onChange={(e) => setSelectedPage(e.target.value)}
        style={{ width: '200px', padding: '10px' }}
      >
        <option value="">Select a page</option>
        {pages.map(page => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>

      {pageStats && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <Card title="Total Followers">{pageStats.followers}</Card>
          <Card title="Total Engagement">{pageStats.engagement}</Card>
        </div>
      )}
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState(null);

  return (
    <>
      {!profile ? (
        <LoginSocialFacebook
          appId="2173024723074421"
          scope="public_profile,email,pages_show_list,pages_read_engagement"
          onResolve={(response) => {
            console.log('Full response:', response); // Log the response to inspect its structure
            setProfile(response.data);
          }}
          onReject={(error) => {
            console.log(error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : null}

      {profile ? (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.picture.data.url} alt={profile.name} />
          <GetPages />
        </div>
      ) : null}
    </>
  );
}

export default App;
