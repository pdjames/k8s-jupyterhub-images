FROM ubuntu:22.04

# Set non-interactive to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install base system utilities and deps
RUN apt-get update && apt-get install -y \
    curl git wget build-essential zlib1g-dev libffi-dev libssl-dev \
    libbz2-dev libreadline-dev libsqlite3-dev libncurses5-dev \
    libncursesw5-dev liblzma-dev tk-dev ca-certificates \
    python3-pip python3-dev python3-venv unzip gnupg software-properties-common && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

### --- Install Java 11, 17, 21 ---
# Add Adoptium repo
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor -o /etc/apt/keyrings/adoptium.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb jammy main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && \
    apt-get install -y \
        temurin-11-jdk \
        temurin-17-jdk \
        temurin-21-jdk

### --- Install Go ---
ENV GO_VERSION=1.22.4
RUN curl -LO https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz && \
    rm go${GO_VERSION}.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:$PATH"

### --- Install Rust ---
ENV CARGO_HOME=/usr/local/cargo
ENV RUSTUP_HOME=/usr/local/rustup
ENV PATH="$CARGO_HOME/bin:$PATH"
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

### --- Install pyenv + Python ---
ENV PYENV_ROOT="/opt/pyenv"
ENV PATH="$PYENV_ROOT/bin:$PYENV_ROOT/shims:$PATH"

RUN git clone https://github.com/pyenv/pyenv.git $PYENV_ROOT && \
    echo 'eval "$(pyenv init -)"' >> /etc/profile.d/pyenv.sh

RUN bash -c "source /etc/profile.d/pyenv.sh && \
    pyenv install 3.7.17 && \
    pyenv install 3.10.14 && \
    pyenv install 3.12.3 && \
    pyenv global 3.10.14 && \
    pip install --upgrade pip && \
    pip install notebook jupyterlab jupyterhub"

ENV PYENV_VERSION=3.10.14
ENV SHELL=/bin/bash

### --- Jupyter-compatible user ---
RUN useradd -m -s /bin/bash jovyan && \
    mkdir -p /home/jovyan/work && \
    chown -R jovyan:jovyan /home/jovyan

USER jovyan
WORKDIR /home/jovyan

EXPOSE 8888

CMD ["jupyterhub-singleuser"]
