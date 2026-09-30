def test_create_subject(client, student):
    resp = client.post("/api/subjects", json={"name": "Test Subject"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Test Subject"
    assert data["progress"] == 0


def test_create_subject_empty_name(client, student):
    resp = client.post("/api/subjects", json={"name": ""})
    assert resp.status_code == 422


def test_add_topic(client, student):
    resp = client.post("/api/subjects", json={"name": "Test Subject"})
    subject_id = resp.json()["id"]
    resp = client.post(f"/api/subjects/{subject_id}/topics", json={"name": "Topic 1"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "Topic 1"


def test_topic_completion_updates_progress(client, student):
    resp = client.post("/api/subjects", json={"name": "Test Subject"})
    subject_id = resp.json()["id"]
    client.post(f"/api/subjects/{subject_id}/topics", json={"name": "Topic 1"})
    client.post(f"/api/subjects/{subject_id}/topics", json={"name": "Topic 2"})

    # Mark one topic done
    topics = client.get(f"/api/subjects/{subject_id}/topics").json()
    client.put(f"/api/topics/{topics[0]['id']}", json={"status": "done"})

    # Check progress is 50%
    resp = client.get("/api/subjects")
    assert resp.json()[0]["progress"] == 50


def test_delete_subject(client, student):
    resp = client.post("/api/subjects", json={"name": "Test Subject"})
    subject_id = resp.json()["id"]
    resp = client.delete(f"/api/subjects/{subject_id}")
    assert resp.status_code == 204
    resp = client.get("/api/subjects")
    assert len(resp.json()) == 0