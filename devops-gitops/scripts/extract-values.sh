
#!/bin/bash

echo "🔍 Extracting values from existing manifests..."

# Find the k8s-manifests directory
if [ -d "../k8s-manifests" ]; then
    MANIFEST_DIR="../k8s-manifests"
elif [ -d "../../k8s-manifests" ]; then
    MANIFEST_DIR="../../k8s-manifests"
elif [ -d "../devops-journey/k8s-manifests" ]; then
    MANIFEST_DIR="../devops-journey/k8s-manifests"
else
    echo "⚠️  Cannot find k8s-manifests directory. Let's extract from running cluster instead."
    MANIFEST_DIR=""
fi

# Extract from Kubernetes cluster (since we have running services)
echo "=== EXTRACTING FROM RUNNING CLUSTER ==="
kubectl get deployment backend -n dev -o jsonpath='{.spec.template.spec.containers[0].image}' > /tmp/backend_image 2>/dev/null || echo "nginx" > /tmp/backend_image
kubectl get deployment backend -n dev -o jsonpath='{.spec.replicas}' > /tmp/backend_replicas 2>/dev/null || echo "2" > /tmp/backend_replicas
kubectl get service backend -n dev -o jsonpath='{.spec.ports[0].port}' > /tmp/backend_port 2>/dev/null || echo "5000" > /tmp/backend_port

kubectl get deployment frontend -n dev -o jsonpath='{.spec.template.spec.containers[0].image}' > /tmp/frontend_image 2>/dev/null || echo "nginx" > /tmp/frontend_image
kubectl get deployment frontend -n dev -o jsonpath='{.spec.replicas}' > /tmp/frontend_replicas 2>/dev/null || echo "2" > /tmp/frontend_replicas
kubectl get service frontend -n dev -o jsonpath='{.spec.ports[0].port}' > /tmp/frontend_port 2>/dev/null || echo "80" > /tmp/frontend_port

kubectl get deployment mongodb -n dev -o jsonpath='{.spec.template.spec.containers[0].image}' > /tmp/mongodb_image 2>/dev/null || echo "mongo:6.0" > /tmp/mongodb_image
kubectl get pvc -n dev -o jsonpath='{.items[0].spec.resources.requests.storage}' > /tmp/mongodb_storage 2>/dev/null || echo "5Gi" > /tmp/mongodb_storage

kubectl get ingress -n dev -o jsonpath='{.spec.rules[0].host}' > /tmp/ingress_host 2>/dev/null || echo "devopsprac.duckdns.org" > /tmp/ingress_host

# Read extracted values
BACKEND_IMAGE=$(cat /tmp/backend_image)
BACKEND_REPLICAS=$(cat /tmp/backend_replicas)
BACKEND_PORT=$(cat /tmp/backend_port)
FRONTEND_IMAGE=$(cat /tmp/frontend_image)
FRONTEND_REPLICAS=$(cat /tmp/frontend_replicas)
FRONTEND_PORT=$(cat /tmp/frontend_port)
MONGODB_IMAGE=$(cat /tmp/mongodb_image)
MONGODB_STORAGE=$(cat /tmp/mongodb_storage)
INGRESS_HOST=$(cat /tmp/ingress_host)

echo "=== BACKEND VALUES ==="
echo "Backend Image: $BACKEND_IMAGE"
echo "Backend Replicas: $BACKEND_REPLICAS"
echo "Backend Port: $BACKEND_PORT"

echo -e "\n=== FRONTEND VALUES ==="
echo "Frontend Image: $FRONTEND_IMAGE"
echo "Frontend Replicas: $FRONTEND_REPLICAS"
echo "Frontend Port: $FRONTEND_PORT"

echo -e "\n=== MONGODB VALUES ==="
echo "MongoDB Image: $MONGODB_IMAGE"
echo "MongoDB Storage: $MONGODB_STORAGE"

echo -e "\n=== INGRESS VALUES ==="
echo "Ingress Host: $INGRESS_HOST"

echo -e "\n=== SERVICE VALUES ==="
kubectl get svc -n dev -o custom-columns="NAME:.metadata.name,TYPE:.spec.type,PORT:.spec.ports[0].port"

# Save extracted values for later use
cat > extracted-values.env << EOL
BACKEND_IMAGE=$BACKEND_IMAGE
BACKEND_REPLICAS=$BACKEND_REPLICAS
BACKEND_PORT=$BACKEND_PORT
FRONTEND_IMAGE=$FRONTEND_IMAGE
FRONTEND_REPLICAS=$FRONTEND_REPLICAS
FRONTEND_PORT=$FRONTEND_PORT
MONGODB_IMAGE=$MONGODB_IMAGE
MONGODB_STORAGE=$MONGODB_STORAGE
INGRESS_HOST=$INGRESS_HOST
EOL

echo -e "\n✅ Values extracted and saved to extracted-values.env"

# Get resource information from deployments
echo -e "\n=== RESOURCE INFORMATION ==="
kubectl get deployment backend -n dev -o jsonpath='{.spec.template.spec.containers[0].resources}' 2>/dev/null || echo "No backend resources found"
kubectl get deployment frontend -n dev -o jsonpath='{.spec.template.spec.containers[0].resources}' 2>/dev/null || echo "No frontend resources found"

# Clean up temp files
rm -f /tmp/backend_image /tmp/backend_replicas /tmp/backend_port /tmp/frontend_image /tmp/frontend_replicas /tmp/frontend_port /tmp/mongodb_image /tmp/mongodb_storage /tmp/ingress_host

