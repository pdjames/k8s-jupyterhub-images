FROM registry.access.redhat.com/ubi8/ubi

# Install basic build tools and dev packages
RUN dnf -y groupinstall "Development Tools" && \
    dnf -y install \
    epel-release \
    git maven gradle curl wget unzip tar sudo \
    openssh-clients openssh-server \
    gcc-c++ make cmake \
    net-tools bind-utils \
    htop nano vim \
    python3 python3-pip \
    nodejs npm \
    docker \
    xrdp tigervnc-server xfce4-session xfce4-panel xfce4-terminal dejavu-sans-fonts firefox \
    ca-certificates tzdata \
    java-17-openjdk java-17-openjdk-devel \
    java-21-openjdk java-21-openjdk-devel \
    && dnf clean all

# Set default Java version to 21
RUN alternatives --set java /usr/lib/jvm/java-21-openjdk/bin/java && \
    alternatives --set javac /usr/lib/jvm/java-21-openjdk/bin/javac

# Setup user for XRDP sessions
RUN useradd -m dev && echo "dev:dev" | chpasswd && echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Setup XFCE as default session for XRDP
RUN echo "startxfce4" > /home/dev/.Xclients && \
    chmod +x /home/dev/.Xclients && \
    chown dev:dev /home/dev/.Xclients

# Enable SSH and XRDP services
RUN systemctl enable sshd && \
    systemctl enable xrdp && \
    sed -i 's/port=3389/port=3389/' /etc/xrdp/xrdp.ini

# Download and install IntelliJ IDEA Community Edition
RUN mkdir -p /opt/intellij && \
    curl -L -o /tmp/intellij.tar.gz https://download.jetbrains.com/idea/ideaIC-2024.1.4.tar.gz && \
    tar -xzf /tmp/intellij.tar.gz -C /opt/intellij --strip-components=1 && \
    ln -s /opt/intellij/bin/idea.sh /usr/local/bin/intellij && \
    rm /tmp/intellij.tar.gz

# Expose RDP port
EXPOSE 3389

# Start xrdp on container start
CMD ["/usr/sbin/xrdp-sesman", "--nodaemon"]
