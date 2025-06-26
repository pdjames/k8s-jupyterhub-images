FROM ubuntu:22.04

# Set non-interactive to avoid tzdata etc. prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install base system utilities
RUN apt-get update && apt-get install -y \
    curl git wget build-essential zlib1g-dev libffi-dev libssl-dev \
    libbz2-dev libreadline-dev libsqlite3-dev libncurses5-dev \
    libncursesw5-dev liblzma-dev tk-dev ca-certificates \
    python3-pip python3-dev python3-venv && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pyenv (multi-version python manager)
ENV PYENV_ROOT="/opt/pyenv"
ENV PATH="$PYENV_ROOT/bin:$PYENV_ROOT/shims:$PATH"

RUN git clone https://github.com/pyenv/pyenv.git $PYENV_ROOT && \
    echo 'eval "$(pyenv init -)"' >> /etc/profile.d/pyenv.sh

# Install Python versions
RUN bash -c "source /etc/profile.d/pyenv.sh && \
    pyenv install 3.7.17 && \
    pyenv install 3.10.14 && \
    pyenv install 3.12.3 && \
    pyenv global 3.10.14 && \
    pip install --upgrade pip && \
    pip install notebook jupyterlab jupyterhub"

# Set default Python to pyenv global
ENV PYENV_VERSION=3.10.14
ENV SHELL=/bin/bash

# Create jupyter-compatible user and directories
RUN useradd -m -s /bin/bash jovyan && \
    mkdir -p /home/jovyan/work && \
    chown -R jovyan:jovyan /home/jovyan

# Set working directory
USER jovyan
WORKDIR /home/jovyan

# Expose Jupyter port
EXPOSE 8888

# Final entrypoint (JupyterHub SingleUser)
CMD ["jupyterhub-singleuser"]
