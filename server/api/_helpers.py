import datetime


def _filter(_list, filter_word, filter_operator, filter_column):
    return [c for c in _list if
            (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
            or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
            or filter_operator == ''
            or filter_column == ''
            or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                         'onOrAfter']
            or search(c[filter_column], filter_operator, filter_word)]


def search(text, filter_operator, filter_word):
    def _contains():
        return True if filter_word in str(text) else False

    def _equals():
        return True if filter_word == str(text) else False

    def _equals_int():
        return True if int(filter_word) == int(text) else False

    def _not_equals():
        return True if int(filter_word) != int(text) else False

    def _starts_with():
        return True if text.startswith(filter_word) else False

    def _lesser():
        return True if int(text) < int(filter_word) else False

    def _lesser_or_equals():
        return True if int(text) <= int(filter_word) else False

    def _greater():
        return True if int(text) > int(filter_word) else False

    def _greater_or_equals():
        return True if int(text) >= int(filter_word) else False

    def _ends_with():
        return True if text.endswith(filter_word) else False

    def _is_empty():
        return True if text == '' else False

    def _is_not_empty():
        return True if text != '' else False

    def _before():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() < datetime.datetime.strptime(filter_word,
                                                                                                "%Y-%m-%d").date()

    def _on_or_before():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() <= datetime.datetime.strptime(filter_word,
                                                                                                 "%Y-%m-%d").date()

    def _on_or_after():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() >= datetime.datetime.strptime(filter_word,
                                                                                                 "%Y-%m-%d").date()

    def _after():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() > datetime.datetime.strptime(filter_word,
                                                                                                "%Y-%m-%d").date()

    def _is():
        return True if str(text).lower() == filter_word else False

    def _not():
        return True if str(text).lower() != filter_word else False

    switcher = {
        "contains": _contains,
        "equals": _equals,
        "startsWith": _starts_with,
        "endsWith": _ends_with,
        "isEmpty": _is_empty,
        "isNotEmpty": _is_not_empty,
        "=": _equals_int,
        "!=": _not_equals,
        "<": _lesser,
        "<=": _lesser_or_equals,
        ">": _greater,
        ">=": _greater_or_equals,
        "before": _before,
        'is': _is,
        'not': _not,
        'onOrBefore': _on_or_before,
        'after': _after,
        'onOrAfter': _on_or_after
    }
    return switcher.get(filter_operator, _contains)()


def _sort(el, sort_column):
    return el.get(sort_column)
