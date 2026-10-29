define Device/vertell_vt-mt7621d
  $(Device/nand)
  DEVICE_VENDOR := Vertell
  DEVICE_MODEL := VT-STREET-M2
  IMAGE_SIZE := 121344k
  KERNEL_SIZE := 4096k
  UBINIZE_OPTS := -E 5
  IMAGE/sysupgrade.bin := append-kernel | pad-to $$(KERNEL_SIZE) | append-ubi | check-size $$(IMAGE_SIZE)
  DEVICE_PACKAGES := -uboot-envtools -wpad-basic-mbedtls -hostapd-common \
	kmod-usb3
endef
TARGET_DEVICES += vertell_vt-mt7621d
