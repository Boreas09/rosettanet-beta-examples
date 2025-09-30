import { Button, Clipboard as ChakraClipboard, IconButton } from "@chakra-ui/react";
import { forwardRef } from "react";
import { LuCheck, LuClipboard } from "react-icons/lu";

const ClipboardIcon = forwardRef(function ClipboardIcon(props, ref) {
  return (
    <ChakraClipboard.Indicator copied={<LuCheck />} {...props} ref={ref}>
      <LuClipboard />
    </ChakraClipboard.Indicator>
  );
});

const ClipboardCopyText = forwardRef(function ClipboardCopyText(props, ref) {
  return (
    <ChakraClipboard.Indicator copied="Copied" {...props} ref={ref}>
      Copy
    </ChakraClipboard.Indicator>
  );
});

export const ClipboardLabel = forwardRef(function ClipboardLabel(props, ref) {
  return (
    <ChakraClipboard.Label
      textStyle="sm"
      fontWeight="medium"
      display="inline-block"
      mb="1"
      {...props}
      ref={ref}
    />
  );
});

export const ClipboardButton = forwardRef(function ClipboardButton(props, ref) {
  return (
    <ChakraClipboard.Trigger asChild>
      <Button ref={ref} size="sm" variant="surface" {...props}>
        <ClipboardIcon />
        <ClipboardCopyText />
      </Button>
    </ChakraClipboard.Trigger>
  );
});

export const ClipboardIconButton = forwardRef(function ClipboardIconButton(props, ref) {
  return (
    <ChakraClipboard.Trigger asChild>
      <IconButton ref={ref} size="xs" variant="subtle" {...props}>
        <ClipboardIcon />
        <ClipboardCopyText srOnly />
      </IconButton>
    </ChakraClipboard.Trigger>
  );
});

export const ClipboardRoot = ChakraClipboard.Root;