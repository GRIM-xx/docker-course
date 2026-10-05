API_NODE_PATH:=../../api-node/
DOCKERHUB_REPO:=kentxki/docker-course-api-node

N?=0

.PHONY: build-N build-all push-N push-all

build-N:
	docker build --file ./Dockerfile.${N} \
		-t api-node:${N} \
		-t ${DOCKERHUB_REPO}:${N} \
		${API_NODE_PATH}

build-all:
	for number in 0 1; do \
		N=$$number $(MAKE) build-N; \
	done

push-N:
	docker push ${DOCKERHUB_REPO}:${N}

push-all:
	for number in 0 1; do \
		N=$$number $(MAKE) push-N; \
	done