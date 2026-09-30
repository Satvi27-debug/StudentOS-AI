def test_create_project(client, student):
    resp = client.post("/api/projects", json={"name": "Test Project", "technology": "Python"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Test Project"
    assert data["status"] == "planning"
    assert data["progress"] == 0


def test_create_project_empty_name(client, student):
    resp = client.post("/api/projects", json={"name": ""})
    assert resp.status_code == 422


def test_project_task_progress(client, student):
    project = client.post("/api/projects", json={"name": "Test Project"}).json()
    client.post(f"/api/projects/{project['id']}/tasks", json={"title": "Task 1"})
    client.post(f"/api/projects/{project['id']}/tasks", json={"title": "Task 2"})

    tasks = client.get(f"/api/projects/{project['id']}/tasks").json()
    client.put(f"/api/project-tasks/{tasks[0]['id']}", json={"done": True})

    resp = client.get(f"/api/projects/{project['id']}")
    assert resp.json()["progress"] == 50


def test_delete_project(client, student):
    project = client.post("/api/projects", json={"name": "Test Project"}).json()
    resp = client.delete(f"/api/projects/{project['id']}")
    assert resp.status_code == 204
    resp = client.get(f"/api/projects/{project['id']}")
    assert resp.status_code == 404