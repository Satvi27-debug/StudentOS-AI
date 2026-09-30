def test_get_profile(client, student):
    resp = client.get("/api/profile")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Test Student"


def test_update_profile(client, student):
    resp = client.put("/api/profile", json={
        "name": "Updated Name",
        "college": "NIT",
        "degree": "B.Tech",
        "target_role": "ML Engineer",
        "interests": ["AI/ML", "Web Dev"],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Updated Name"
    assert data["college"] == "NIT"
    assert data["target_role"] == "ML Engineer"
    assert data["interests"] == ["AI/ML", "Web Dev"]


def test_profile_persists(client, student):
    client.put("/api/profile", json={"name": "Persisted Name"})
    resp = client.get("/api/profile")
    assert resp.json()["name"] == "Persisted Name"