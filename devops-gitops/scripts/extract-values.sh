#!/bin/bash

echo "🔍 Extracting values from existing manifests..."

MANIFEST_DIR=".../k8s-manifests"

# Extract backend values
echo "=== BACKEND VALUES ==="
BACKEND_IMAGE=$(grep -A 5 "containers:" $MANIFEST_DIR/backend.yaml | grep "image:" | awk '{print $2}' | tr -d '"')
BACKEND_REPLICAS=$(grep "replicas:" $MANIFEST_DIR/backend.yaml | awk '{print $2}')
BACKEND_PORT=$(grep -A 10 "ports:" $MANIFEST_DIR/backend.yaml | grep "containerPort:" | awk '{print $2}')
BACKEND_CPU_REQ=$(grep -A 5 "requests:" $MANIFEST_DIR/backend.yaml | grep "cpu:" | awk '{print $2}' | tr -d '"')
BACKEND_MEM_REQ=$(grep -A 5 "requests:" $MANIFEST_DIR/backend.yaml | grep "memory:" | awk '{print $2}' | tr -d '"')

echo "Backend Image: $BACKEND_IMAGE"
echo "Backend Replicas: $BACKEND_REPLICAS"
echo "Backend Port: $BACKEND_PORT"
echo "Backend CPU Request: $BACKEND_CPU_REQ"
echo "Backend Memory Request: $BACKEND_MEM_REQ"

# Extract frontend values
echo -e "\n=== FRONTEND VALUES ==="
FRONTEND_IMAGE=$(grep -A 5 "containers:" $MANIFEST_DIR/frontend.yaml | grep "image:" | awk '{print $2}' | tr -d '"')
FRONTEND_REPLICAS=$(grep "replicas:" $MANIFEST_DIR/frontend.yaml | awk '{print $2}')
FRONTEND_PORT=$(grep -A 10 "ports:" $MANIFEST_DIR/frontend.yaml | grep "containerPort:" | awk '{print $2}')

echo "Frontend Image: $FRONTEND_IMAGE"
echo "Frontend Replicas: $FRONTEND_REPLICAS" 
echo "Frontend Port: $FRONTEND_PORT"

# Extract MongoDB values
echo -e "\n=== MONGODB VALUES ==="
MONGODB_IMAGE=$(grep -A 5 "containers:" $MANIFEST_DIR/mongodb.yaml | grep "image:" | awk '{print $2}' | tr -d '"')
MONGODB_STORAGE=$(grep -A 5 "resources:" $MANIFEST_DIR/mongodb-pv.yaml | grep "storage:" | awk '{print $2}' | tr -d '"' || echo "5Gi")

echo "MongoDB Image: $MONGODB_IMAGE"
echo "MongoDB Storage: $MONGODB_STORAGE"

# Extract ingress values
echo -e "\n=== INGRESS VALUES ==="
INGRESS_HOST=$(grep "host:" $MANIFEST_DIR/ingress.yaml | awk '{print $2}' | tr -d '"')
echo "Ingress Host: $INGRESS_HOST"

# Extract service information
echo -e "\n=== SERVICE VALUES ==="
kubectl get svc -n dev -o custom-columns="NAME:.metadata.name,TYPE:.spec.type,PORT:.spec.ports[0].port" 2>/dev/null || echo "Services not found - will extract from YAML"

# Save extracted values for later use
cat > extracted-values.env << EOL
BACKEND_IMAGE=$BACKEND_IMAGE
BACKEND_REPLICAS=$BACKEND_REPLICAS
BACKEND_PORT=$BACKEND_PORT
BACKEND_CPU_REQ=$BACKEND_CPU_REQ
BACKEND_MEM_REQ=$BACKEND_MEM_REQ
FRONTEND_IMAGE=$FRONTEND_IMAGE
FRONTEND_REPLICAS=$FRONTEND_REPLICAS
FRONTEND_PORT=$FRONTEND_PORT
MONGODB_IMAGE=$MONGODB_IMAGE
MONGODB_STORAGE=$MONGODB_STORAGE
INGRESS_HOST=$INGRESS_HOST
EOL

echo -e "\n✅ Values extracted and saved to extracted-values.env"