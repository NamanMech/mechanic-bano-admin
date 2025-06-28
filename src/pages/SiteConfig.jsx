import { useEffect, useState } from "react";

function SiteConfig() {
  const [site, setSite] = useState({ siteName: "", logoUrl: "" });

  const fetchConfig = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logo`);
    const data = await res.json();
    setSite(data || {});
  };

  const updateConfig = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site)
    });
    alert("Updated Successfully");
  };

  useEffect(() => { fetchConfig(); }, []);

  return (
    <div className="p-4">
      <input value={site.siteName} onChange={(e) => setSite({ ...site, siteName: e.target.value })} placeholder="Site Name" className="border p-2 mr-2" />
      <input value={site.logoUrl} onChange={(e) => setSite({ ...site, logoUrl: e.target.value })} placeholder="Logo URL" className="border p-2 mr-2" />
      <button onClick={updateConfig} className="bg-green-500 text-white p-2 rounded mt-2">Update</button>
    </div>
  );
}

export default SiteConfig;
