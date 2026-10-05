CLIENT_PATH:=../../client/
DOCKERHUB_REPO:=kentxki/docker-course-client

N?=0

.PHONY: build-N build-all push-N push-all

build-N:
	docker build --file ./Dockerfile.${N} \
		-t client:${N} \
		-t ${DOCKERHUB_REPO}:${N} \
		${CLIENT_PATH}

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