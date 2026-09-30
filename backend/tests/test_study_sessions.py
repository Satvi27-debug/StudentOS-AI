from datetime import date


def test_create_session(client, student):
    subject = client.post("/api/subjects", json={"name": "DBMS"}).json()
    resp = client.post("/api/study-sessions", json={
        "subject_id": subject["id"],
        "duration_minutes": 45,
        "session_date": str(date.today()),
    })
    assert resp.status_code == 201
    assert resp.json()["duration_minutes"] == 45


def test_create_session_invalid_duration(client, student):
    subject = client.post("/api/subjects", json={"name": "DBMS"}).json()
    resp = client.post("/api/study-sessions", json={
        "subject_id": subject["id"],
        "duration_minutes": -5,
        "session_date": str(date.today()),
    })
    assert resp.status_code == 422


def test_study_stats(client, student):
    subject = client.post("/api/subjects", json={"name": "DBMS"}).json()
    client.post("/api/study-sessions", json={
        "subject_id": subject["id"],
        "duration_minutes": 30,
        "session_date": str(date.today()),
    })
    client.post("/api/study-sessions", json={
        "subject_id": subject["id"],
        "duration_minutes": 45,
        "session_date": str(date.today()),
    })
    resp = client.get("/api/study-sessions/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["today_minutes"] == 75
    assert data["week_minutes"] == 75
    assert len(data["by_subject"]) == 1
    assert data["by_subject"][0]["subject"] == "DBMS"
    assert data["by_subject"][0]["minutes"] == 75