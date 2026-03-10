API_PATH:=../client-react
DOCKERHUB_REPO:=kentxki/docker-course-client-react-nginx

N?=0

.PHONY: build-N
build-N:
	docker build -f ./Dockerfile.${N} \
	-t client-react:${N} \
	-t ${DOCKERHUB_REPO}:${N} \
	${API_PATH}

.PHONY: push-N
push-N:
	docker push ${DOCKERHUB_REPO}:${N}

.PHONY: build-all
build-all:
	for num in 1 2 3 4 5 6 ; do \
		$(MAKE) N=$$num build-N; \
	done

.PHONY: push-all
push-all:
	for num in 1 2 3 4 5 6 ; do \
		$(MAKE) N=$$num push-N; \
	done