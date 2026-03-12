.PHONY: build-push
build-push:
	cd ../dockerfiles/client-react && N=6 ${MAKE} build-N && N=6 ${MAKE} push-N
	cd ../dockerfiles/api-node && N=9 ${MAKE} build-N && N=9 ${MAKE} push-N
	cd ../dockerfiles/api-golang && N=9 ${MAKE} build-N && N=9 ${MAKE} push-N