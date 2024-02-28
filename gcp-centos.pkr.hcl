packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  type    = string
  default = "spring6225-dev-1"
}

variable "source_image" {
  type    = string
  default = "image-1"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

source "googlecompute" "centos_stream8" {
  project_id   = var.project_id
  source_image = var.source_image
  ssh_username = var.ssh_username
  zone         = "us-east1-b"
  disk_size    = "100"
  image_name   = "centos-stream8-{{timestamp}}"
}

build {
  sources = ["source.googlecompute.centos_stream8"]

  provisioner "file" {
    source      = "Neha_Shende_002783740_05.zip"
    destination = "/tmp/Neha_Shende_002783740_05"
  }

  provisioner "shell" {
    environment_vars = [
      "CHECKPOINT_DISABLE=1"
    ]
    script            = "setupCentOS.sh"
    expect_disconnect = true
    valid_exit_codes  = [0, 2300218]
  }

  provisioner "shell" {
    inline = [
      "echo 'admin:cloud' | sudo chpasswd"
    ]
  }
}
