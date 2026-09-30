def test_create_task(client, student):
    resp = client.post("/api/tasks", json={"title": "Test task", "category": "study", "priority": "high"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test task"
    assert data["category"] == "study"
    assert data["priority"] == "high"
    assert data["status"] == "todo"


def test_create_task_empty_title(client, student):
    resp = client.post("/api/tasks", json={"title": ""})
    assert resp.status_code == 422


def test_list_tasks(client, student):
    client.post("/api/tasks", json={"title": "Task 1"})
    client.post("/api/tasks", json={"title": "Task 2"})
    resp = client.get("/api/tasks")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_get_task(client, student):
    resp = client.post("/api/tasks", json={"title": "Test task"})
    task_id = resp.json()["id"]
    resp = client.get(f"/api/tasks/{task_id}")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Test task"


def test_get_task_not_found(client, student):
    resp = client.get("/api/tasks/9999")
    assert resp.status_code == 404


def test_update_task(client, student):
    resp = client.post("/api/tasks", json={"title": "Original"})
    task_id = resp.json()["id"]
    resp = client.put(f"/api/tasks/{task_id}", json={"title": "Updated", "status": "done"})
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated"
    assert resp.json()["status"] == "done"
    assert resp.json()["completed_at"] is not None


def test_delete_task(client, student):
    resp = client.post("/api/tasks", json={"title": "To delete"})
    task_id = resp.json()["id"]
    resp = client.delete(f"/api/tasks/{task_id}")
    assert resp.status_code == 204
    resp = client.get(f"/api/tasks/{task_id}")
    assert resp.status_code == 404


def test_filter_by_status(client, student):
    client.post("/api/tasks", json={"title": "Task 1"})
    client.post("/api/tasks", json={"title": "Task 2", "status": "done"})
    resp = client.get("/api/tasks?status=done")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["title"] == "Task 2"