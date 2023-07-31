# syntax = docker/dockerfile:1.3

# The build stage
# ---------------
# This stage is building Python wheels for use in later stages by using a base
# image that has more pre-requisites to do so, such as a C++ compiler.
#
# NOTE: If the image version is updated, also update it in ci/refreeze and
#       hub's Dockerfile!


FROM ubuntu:22.04 as build-stage
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/London

# Build wheels
#
# We set pip's cache directory and expose it across build stages via an
# ephemeral docker cache (--mount=type=cache,target=${PIP_CACHE_DIR}). We use
# the same technique for the directory /tmp/wheels.
#
RUN apt update -y && \
    apt install software-properties-common build-essential curl -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt update -y && \
    apt install python3.10 python3.10-dev -y && \
    apt install python3.11 python3.11-dev -y && \
    apt install python3-dev -y && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.11 10
    
RUN apt update -y && \
    apt install build-essential -y && \
    apt install unzip curl rsync git nfs-common -y && \
    apt install python3.10-venv python3.11-venv -y
    
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10 

COPY requirements.txt requirements.txt
ARG PIP_CACHE_DIR=/tmp/pip-cache
RUN --mount=type=cache,target=${PIP_CACHE_DIR} \
    pip install build \
 && pip wheel \
        --wheel-dir=/tmp/wheels \
        -r requirements.txt


# The final stage
# ---------------
#
FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/London

RUN apt update -y && \
    apt install software-properties-common build-essential nano curl libssl-dev -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt update -y && \
    apt install python3.10-dev python3.10-venv python3.10-distutils python3.10-gdbm python3.10-tk python3.10-lib2to3 python3.10 -y && \
    apt install python3.11-dev python3.11-venv python3.11-distutils python3.11-gdbm python3.11-tk python3.11-lib2to3 python3.11 -y && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.11 10 && \
    apt install distcc
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python 

ENV NB_USER=jovyan \
    NB_UID=1000 \
    NB_GID=100 \
    HOME=/home/jovyan
RUN adduser \
        --disabled-password \
        --gecos "Default user" \
        --uid ${NB_UID} \
        --gid ${NB_GID} \
        --home ${HOME} \
        --force-badname \
        ${NB_USER}

RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y --no-install-recommends \
        ca-certificates \
        dnsutils \
        iputils-ping \
        tini \
        # requirement for nbgitpuller
        git \
 && rm -rf /var/lib/apt/lists/*

# install wheels built in the build-stage
COPY requirements.txt /tmp/requirements.txt
ARG PIP_CACHE_DIR=/tmp/pip-cache
RUN --mount=type=cache,target=${PIP_CACHE_DIR} \
    --mount=type=cache,from=build-stage,source=/tmp/wheels,target=/tmp/wheels \
    pip install \
        --find-links=/tmp/wheels/ \
        -r /tmp/requirements.txt

WORKDIR ${HOME}
RUN mkdir -p ${HOME}/.local/share/jupyter
RUN chown -R ${NB_UID}:${NB_GID} ${HOME}
RUN chmod -R 777 ${HOME}
USER ${NB_USER}

EXPOSE 8888
ENTRYPOINT ["tini", "--"]
CMD ["jupyter", "lab"]
