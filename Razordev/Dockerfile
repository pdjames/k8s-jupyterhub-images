FROM rockylinux:8

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8

RUN dnf -y install dnf-plugins-core

RUN dnf config-manager --set-enabled powertools

# Install base dev and desktop tools
RUN dnf -y update && \
    dnf -y install dnf-utils epel-release && \
    dnf config-manager --set-enabled powertools && \
    dnf config-manager --enable epel && \
    dnf -y install \
        gcc gcc-c++ make automake autoconf libtool \
        git maven curl wget unzip tar \
        openssh-clients openssh-server \
        net-tools bind-utils \
        vim nano sudo \
        python3 python3-pip \
        nodejs npm \
        docker \
        xrdp tigervnc-server \
        xfce4-session xfce4-panel xfce4-terminal \
        dejavu-sans-fonts firefox && \
    dnf clean all

ENV GRADLE_VERSION=8.7

RUN curl -L -o /tmp/gradle.zip https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip && \
    unzip /tmp/gradle.zip -d /opt && \
    ln -s /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/local/bin/gradle && \
    rm /tmp/gradle.zip

# Install both JDKs and register Java 21 as the default
RUN dnf -y install java-17-openjdk java-17-openjdk-devel java-21-openjdk java-21-openjdk-devel && \
    alternatives --install /usr/bin/java java /usr/lib/jvm/java-21-openjdk/bin/java 2 && \
    alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-21-openjdk/bin/javac 2 && \
    alternatives --set java /usr/lib/jvm/java-21-openjdk/bin/java && \
    alternatives --set javac /usr/lib/jvm/java-21-openjdk/bin/javac

# Setup user
RUN useradd -m dev && echo "dev:dev" | chpasswd && echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Set default XFCE session
RUN echo "startxfce4" > /home/dev/.Xclients && \
    chmod +x /home/dev/.Xclients && \
    chown dev:dev /home/dev/.Xclients

# IntelliJ Community Edition
RUN mkdir -p /opt/intellij && \
    curl -L -o /tmp/intellij.tar.gz https://download.jetbrains.com/idea/ideaIC-2024.1.4.tar.gz && \
    tar -xzf /tmp/intellij.tar.gz -C /opt/intellij --strip-components=1 && \
    ln -s /opt/intellij/bin/idea.sh /usr/local/bin/intellij && \
    rm /tmp/intellij.tar.gz

# Enable services
RUN systemctl enable xrdp && \
    systemctl enable sshd

EXPOSE 3389
CMD ["/usr/sbin/xrdp-sesman", "--nodaemon"]
